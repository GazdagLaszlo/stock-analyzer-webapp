using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.DataContext.DTOs
{
    public class TradeSummaryDto
    {
        public double? TotalProfitLoss { get; set; }
        public double? WinRate { get; set; }
        public int? TotalClosedTrades { get; set; }
        public int? ProfitableTradesCount { get; set; }
        public int? LosingTradesCount { get; set; }
        public double? AverageGain { get; set; }
        public double? AverageLoss { get; set; }
        //Risk to Reward Ratio
        public double? AverageRRR { get; set; }
        public double? ProfitFactor { get; set; }
        public double? TotalVolume { get; set; }
        public IList<ClosedTradeDto>? ClosedTrades { get; set; } = new List<ClosedTradeDto>();
        public ClosedTradeDto? BestTrade { get; set; }
        public ClosedTradeDto? WorstTrade { get; set; }
    }

    public class ClosedTradeDto
    {
        public Guid TradeId { get; set; }
        public string StockSymbol { get; set; }
        public string StockName { get; set; }
        public double RealizedProfit { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public double TotalQuantity { get; set; }
        public IList<TransactionDto> Transactions { get; set; }
        public string Sector { get; set; }
        public double PositionSize { get; set; }
    }
}
