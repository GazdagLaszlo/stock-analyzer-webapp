using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
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
        private readonly string _finnhubApiKey;
        private ClientWebSocket? _webSocket;        
        private readonly ConcurrentDictionary<string, int> _subscriptionCount = new();
        private readonly ConcurrentDictionary<string, decimal> _latest = new();
        public IReadOnlyDictionary<string, decimal> Latest => _latest;

        private bool _listeningLoopStarted = false;

        public StockPriceUpdaterWebSocketService(IConfiguration configuration)
        {
            _finnhubApiKey = configuration["FinnhubApiKey:ApiKey"];
        }
        public async Task ConnectAndListenAsync(string symbol, bool subscribe, Func<string, decimal, Task> onTick, CancellationToken cancellationToken)
        { 
            if (_webSocket == null || _webSocket.State != WebSocketState.Open)
            {
                _webSocket = new ClientWebSocket();
                await _webSocket.ConnectAsync(new Uri($"wss://ws.finnhub.io?token={_finnhubApiKey}"), cancellationToken);
                Console.WriteLine("WebSocket connection started...");
            }

            if (!_listeningLoopStarted)
            {
                _listeningLoopStarted = true;
                _ = Task.Run(async () =>
                {
                    var buffer = new byte[8192];
                    while (!cancellationToken.IsCancellationRequested && _webSocket.State == WebSocketState.Open)
                    {
                        var result = await _webSocket.ReceiveAsync(buffer, cancellationToken);
                        var json = Encoding.UTF8.GetString(buffer, 0, result.Count);
                        using var doc = JsonDocument.Parse(json);

                        if (doc.RootElement.TryGetProperty("data", out var dataArray) && dataArray.ValueKind == JsonValueKind.Array)
                        {
                            foreach (var tick in dataArray.EnumerateArray())
                            {
                                var tickSymbol = tick.GetProperty("s").GetString();
                                var tickPrice = tick.GetProperty("p").GetDecimal();

                                Console.WriteLine("Symbol: " + tickSymbol + ", Price: " + tickPrice);

                                if (tickSymbol != null)
                                {
                                    _latest[tickSymbol] = tickPrice;                                    
                                    await onTick(tickSymbol, tickPrice);
                                }
                            }
                        }
                    }
                });
            }


            if (subscribe)
            {
                _subscriptionCount.AddOrUpdate(symbol, 1, (_, count) => count + 1);
                if (_subscriptionCount[symbol] == 1)
                {
                    //Ha ő iratkozik fel elsőként akkor feliratkozunk
                    var msg = JsonSerializer.Serialize(new { type = "subscribe", symbol });
                    await _webSocket.SendAsync(Encoding.UTF8.GetBytes(msg), WebSocketMessageType.Text, true, cancellationToken);
                }
            }
            else
            {
                if (_subscriptionCount.TryGetValue(symbol, out int count) && count > 0)
                {
                    _subscriptionCount[symbol] = count - 1;
                    if (_subscriptionCount[symbol] == 0) // senki sem nézi már -> Leiratkozunk
                    {
                        var msg = JsonSerializer.Serialize(new { type = "unsubscribe", symbol });
                        await _webSocket.SendAsync(Encoding.UTF8.GetBytes(msg), WebSocketMessageType.Text, true, cancellationToken);
                    }
                }
            }            
        }    
    }
}
