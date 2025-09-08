using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace StockManager.Services
{
    public class StockPriceUpdaterWebSocketService
    {
        const string finnhubApiKey = "";
        private readonly HttpClient _httpClient;
        private readonly IServiceScopeFactory _scopeFactory;

        private readonly ConcurrentDictionary<string, decimal> _latest = new();
        public IReadOnlyDictionary<string, decimal> Latest => _latest;

        public StockPriceUpdaterWebSocketService(HttpClient httpClient, IServiceScopeFactory scopeFactory)
        {
            _httpClient = httpClient;
            _scopeFactory = scopeFactory;
        }        
        public async Task ConnectAndListenAsync(IEnumerable<string> symbols, CancellationToken cancellationToken)
        {            
            using var scope = _scopeFactory.CreateScope();
            var stockUpdater = scope.ServiceProvider.GetRequiredService<StockUpdaterService>();
            bool marketStatus = await stockUpdater.CheckMarketStatus();

            if (!marketStatus)
            {
                Console.WriteLine("Market closed. WebSocket not starting!");
                return;
            }

            Console.WriteLine("WebSocket connection started...");
            using var webSocket = new ClientWebSocket();
            await webSocket.ConnectAsync(new Uri($"wss://ws.finnhub.io?token={finnhubApiKey}"), cancellationToken);

            // Feliratkozás
            foreach (var s in symbols)
            {
                var subscribeMsg = JsonSerializer.Serialize(new { type = "subscribe", symbol = s });
                await webSocket.SendAsync(Encoding.UTF8.GetBytes(subscribeMsg), WebSocketMessageType.Text, true, cancellationToken);
            }

            var buffer = new byte[8192];
            while (!cancellationToken.IsCancellationRequested && webSocket.State == WebSocketState.Open)
            {
                var result = await webSocket.ReceiveAsync(buffer, cancellationToken);
                var json = Encoding.UTF8.GetString(buffer, 0, result.Count);

                using var doc = JsonDocument.Parse(json);
                var jsonx = Encoding.UTF8.GetString(buffer, 0, result.Count);                
                if (doc.RootElement.TryGetProperty("data", out var dataArray) && dataArray.ValueKind == JsonValueKind.Array)
                {
                    foreach (var tick in dataArray.EnumerateArray())
                    {                        
                        var symbol = tick.GetProperty("s").GetString();
                        var price = tick.GetProperty("p").GetDecimal();
                        if (symbol != null)
                        {
                            _latest[symbol] = price;
                        }
                    }
                }
            }
        }    
    }
}
