using Microsoft.AspNetCore.SignalR;
using StockManager.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Services
{
    public interface IPriceBroadcaster
    {
        Task BroadcastPriceAsync(string symbol, decimal price);
    }

    public class PriceBroadcaster : IPriceBroadcaster
    {
        private readonly IHubContext<StockPriceHub> _hubContext;

        public PriceBroadcaster(IHubContext<StockPriceHub> hubContext)
        {
            _hubContext = hubContext;
        }

        public async Task BroadcastPriceAsync(string symbol, decimal price)
        {
            await _hubContext.Clients.Group(symbol).SendAsync("ReceiveRate", symbol, price);
        }
    }
}
