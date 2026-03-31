using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.DataContext.DTOs
{
    public enum TradeInsightType
    {
        Info = 0,
        Warning = 1,
        Danger = 2,
    }
    public class TradeInsightDto
    {
        public string? Title { get; set; }
        public string? Explanation { get; set; }
        public string? Advice {  get; set; }
        public TradeInsightType? Type { get; set; }
    }
}
