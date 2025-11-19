using StockManager.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace StockManager.DataContext.DTOs
{
    public class StockDataItemDto
    {
        public int Id { get; set; }
        public DateOnly? Period { get; set; }
        public PeriodType PeriodType { get; set; }
        public decimal? V { get; set; }
        public string MetricName { get; set; }
        public int StockDataId { get; set; }
    }
}
