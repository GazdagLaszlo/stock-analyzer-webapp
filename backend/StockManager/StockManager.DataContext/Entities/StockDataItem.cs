using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace StockManager.DataContext.Entities
{
    public enum PeriodType
    {
        Annual,
        Quarterly
    }
    public class StockDataItem
    {
        public int Id { get; set; }
        [JsonPropertyName("period")]
        public DateOnly? Period { get; set; }
        public PeriodType PeriodType { get; set; }
        [JsonPropertyName("v")]
        public decimal? V { get; set; }
        public string MetricName { get; set; }
        public int StockDataId { get; set; }
        public StockData StockData { get; set; }
    }
}
