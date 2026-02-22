using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.DataContext.DTOs
{
    public class TradeSummaryDto
    {
        public double TotalProfitLoss { get; set; }
        public double WinRate { get; set; }
        public int TotalClosedTrades { get; set; }
        public int ProfitableTradesCount { get; set; }
        public int LosingTradesCount { get; set; }
        public double AverageGain { get; set; }
        public double AverageLoss { get; set; }
        //Risk to Reward Ratio
        public double AverageRRR { get; set; }
        public double ProfitFactor { get; set; }
        public TransactionDto BestTrade { get; set; }
        public TransactionDto WorstTrade { get; set; }
    }
}
