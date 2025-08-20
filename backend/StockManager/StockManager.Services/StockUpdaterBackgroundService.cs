    
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
                try
                {
                    using var scope = _scopeFactory.CreateScope();
                    var updaterService = scope.ServiceProvider.GetRequiredService<StockUpdaterService>();
                    await updaterService.GetSP500Stocks();

                    await Task.Delay(TimeSpan.FromDays(1), stoppingToken);                                    
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Hiba a háttérszolgáltatásban: {ex.Message}");
                    await Task.Delay(5000, stoppingToken);
                }
            }
        }
    }
}
