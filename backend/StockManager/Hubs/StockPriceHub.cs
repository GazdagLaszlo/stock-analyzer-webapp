using Microsoft.AspNetCore.SignalR;
using StockManager.Services;

namespace StockManager.Hubs
{
    public class StockPriceHub : Hub
    {
        private readonly StockPriceUpdaterWebSocketService _updater;
        private readonly IPriceBroadcaster _broadcaster;
        public StockPriceHub(StockPriceUpdaterWebSocketService updater, IPriceBroadcaster broadcaster)
        {
            _updater = updater;
            _broadcaster = broadcaster;
        }

        public async Task Subscribe(string symbol)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, symbol);
            await _updater.ConnectAndListenAsync(symbol, true, async (symbol, price) =>
            {
                await _broadcaster.BroadcastPriceAsync(symbol, price);
            }, CancellationToken.None);
            await Clients.Caller.SendAsync("Subscribed", symbol);
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
    }
}
