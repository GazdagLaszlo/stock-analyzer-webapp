using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace StockManager.DataContext.Entities
{
    public class StockQuote
    {
        [JsonPropertyName("c")]
        public double CurrentPrice { get; set; }
        [JsonPropertyName("d")]
        public double Change {  get; set; }
        [JsonPropertyName("dp")]
        public double PercentChange { get; set; }
        [JsonPropertyName("pc")]
        public double PreviousClosePrice { get; set; }
    }
}
