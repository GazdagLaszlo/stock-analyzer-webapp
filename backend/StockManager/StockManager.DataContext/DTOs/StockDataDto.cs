using StockManager.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.DataContext.DTOs
{
    public class StockDataDto
    {
        public int Id { get; set; }
        public int StockId { get; set; }
        public double? EPS { get; set; }
        public double? PriceToEarningsRatio { get; set; }
        public double? PriceToBookRatio { get; set; }
        public double? DebtToEquityRatio { get; set; }
        public double? DividendYield { get; set; }
    }

    public class StockDataCreateDto
    {
        public int StockId { get; set; }
        public DateTime Date { get; set; }
        public double? EPS { get; set; }
        public double? PriceToEarningsRatio { get; set; }
        public double? PriceToBookRatio { get; set; }
        public double? DebtToEquityRatio { get; set; }
        public double? DividendYield { get; set; }
    }

    public class StockDataUpdateDto
    {
        public int StockId { get; set; }      
        public DateTime Date { get; set; }
        public double? EPS { get; set; }
        public double? PriceToEarningsRatio { get; set; }
        public double? PriceToBookRatio { get; set; }
        public double? DebtToEquityRatio { get; set; }
        public double? DividendYield { get; set; }
    }
}
