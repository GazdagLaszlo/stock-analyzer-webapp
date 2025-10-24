using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace StockManager.DataContext.Entities
{
    public class StockNews
    {
        [JsonPropertyName("category")]
        public string Category {  get; set; }
        [JsonPropertyName("datetime")]
        public int DateTime { get; set; }
        [JsonPropertyName("headline")]
        public string HeadLine { get; set; }
        [JsonPropertyName("image")]
        public string Image { get; set; }
        [JsonPropertyName("summary")]
        public string Summary { get; set; }
        [JsonPropertyName("url")]
        public string Url { get; set; }
    }
}
