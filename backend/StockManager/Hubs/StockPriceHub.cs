using Microsoft.AspNetCore.SignalR;
using StockManager.Services;
using System.Collections.Concurrent;

namespace StockManager.Hubs
{
    public class StockPriceHub : Hub
    {
        private readonly StockPriceUpdaterWebSocketService _updater;
        private readonly IPriceBroadcaster _broadcaster;
        private static readonly ConcurrentDictionary<string, HashSet<string>> _connectionSymbols = new();
        public StockPriceHub(StockPriceUpdaterWebSocketService updater, IPriceBroadcaster broadcaster)
        {
            _updater = updater;
            _broadcaster = broadcaster;
        }

        public async Task Subscribe(string symbol)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, symbol);

            _connectionSymbols.AddOrUpdate(
                Context.ConnectionId,
                new HashSet<string> { symbol },
                (_, set) => { set.Add(symbol); return set; }
            );

            await _updater.ConnectAndListenAsync(symbol, true, async (symbol, price) =>
            {
                await _broadcaster.BroadcastPriceAsync(symbol, price);
            }, CancellationToken.None);
            //await Clients.Caller.SendAsync("Subscribed", symbol);
        }

        public async Task Unsubscribe(string symbol)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, symbol);
            await _updater.ConnectAndListenAsync(symbol, false, async (symbol, price) =>
            {
                await _broadcaster.BroadcastPriceAsync(symbol, price);
            }, CancellationToken.None);
            await Clients.Caller.SendAsync("Unsubscribed", symbol);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {            
            if (_connectionSymbols.TryRemove(Context.ConnectionId, out var symbols))
            {
                foreach (var symbol in symbols)
                {
                    await Groups.RemoveFromGroupAsync(Context.ConnectionId, symbol);
                    await _updater.ConnectAndListenAsync(symbol, false, async (s, price) =>
                    {
                        await _broadcaster.BroadcastPriceAsync(s, price);
                    }, CancellationToken.None);
                }
            }

            await base.OnDisconnectedAsync(exception);
        }

        private async Task RemoveSymbol(string symbol)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, symbol);

            if (_connectionSymbols.TryGetValue(Context.ConnectionId, out var symbols))
            {
                symbols.Remove(symbol);
            }

            await _updater.ConnectAndListenAsync(symbol, false, async (s, price) =>
            {
                await _broadcaster.BroadcastPriceAsync(s, price);
            }, CancellationToken.None);
        }
    }
}
