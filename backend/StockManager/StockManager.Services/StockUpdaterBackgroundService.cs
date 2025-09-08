    
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using StockManager.DataContext.Entities;
using System.Net.Http;
using System.Net.Http.Json;
using System.Security.Cryptography.X509Certificates;
using System.Text.Json;
using StockManager.DataContext.DTOs;

namespace StockManager.Services
{
    public class StockUpdaterBackgroundService : BackgroundService
    {
        public readonly IServiceScopeFactory _scopeFactory;

        public StockUpdaterBackgroundService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            //Csak akkor kéri le, ha nyitva a piac
            var symbols = new List<string> { "BINANCE:BTCUSDT" };

            using var scope = _scopeFactory.CreateScope();

            var wsService = scope.ServiceProvider.GetRequiredService<StockPriceUpdaterWebSocketService>();
            var updaterService = scope.ServiceProvider.GetRequiredService<StockUpdaterService>();
            bool isOpen = await updaterService.CheckMarketStatus();

            //Ellenőrizni, hogy mikor fusson a websocket és mikor kérjünk le árfolyamot. Ne fusson le mind a 2
            Task? wsTask = null;
            if (isOpen)
            {
                wsTask = wsService.ConnectAndListenAsync(symbols, stoppingToken);
            }

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {                    
                    await updaterService.GetStocks();
                    await Task.Delay(TimeSpan.FromDays(1), stoppingToken);                         
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Hiba a háttérszolgáltatásban: {ex.Message}");
                    await Task.Delay(5000, stoppingToken);
                }
            }

            if (wsTask != null)
            {
                try
                {
                    await wsTask;
                }
                catch (OperationCanceledException)
                {
                    
                }
            }
        }    
    }
}
