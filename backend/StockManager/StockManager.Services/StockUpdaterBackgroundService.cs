    
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
            while (!stoppingToken.IsCancellationRequested)
            {
                //Csak akkor kéri le, ha nyitva a piac

                using var scope = _scopeFactory.CreateScope();

                var wsService = scope.ServiceProvider.GetRequiredService<StockPriceUpdaterWebSocketService>();
                var updaterService = scope.ServiceProvider.GetRequiredService<StockUpdaterService>();
                var stockService = scope.ServiceProvider.GetRequiredService<IStockService>();
                var stockReportService = scope.ServiceProvider.GetRequiredService<IStockReportService>();
                var stockDataService = scope.ServiceProvider.GetRequiredService<IStockDataService>();

                bool isOpen = await updaterService.CheckMarketStatus();

                var stocks = await stockService.GetAllAsync();
                //Ellenőrizni, hogy mikor fusson a websocket és mikor kérjünk le árfolyamot. Ne fusson le mind a 2

                try
                {
                    await updaterService.GetStocks();

                    //StockData update
                    //Finnhub Earnings Calendar végpontot felhasználni - Ritkítani a frissítést                    
                    foreach (var stock in stocks)
                    {
                        try
                        {
                            //await stockDataService.StockDataRefresh(stock);
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Error while refreshing StockData to {stock.Symbol}: {ex.Message}");
                        }
                    }

                    //Napi 1x ellenőrzi hogy van-e új report az adott részvényhez.
                    foreach (var stock in stocks)
                    {
                        try
                        {
                            //await stockReportService.GetStockReportsFromAPI(stock.Symbol);
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Error while getting stockReport to {stock.Symbol}: {ex.Message}");
                        }
                    }

                    await Task.Delay(TimeSpan.FromDays(1), stoppingToken);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error in backgroundService: {ex.Message}");
                    await Task.Delay(5000, stoppingToken);
                }                            
            }
        }    
    }
}
