using StockManager.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace StockManager.DataContext.DTOs
{
    public class StockCreateDto
    {
        [JsonPropertyName("ticker")]
        public string Symbol { get; set; }
        [JsonPropertyName("marketCapitalization")]
        public double? MarketCap { get; set; }
        [JsonPropertyName("name")]
        public string CompanyName { get; set; }
        [JsonPropertyName("finnhubIndustry")]
        public string Sector {  get; set; }
        public double Price { get; set; }        
        [JsonPropertyName("exchange")]
        public string Exchange { get; set; }
        [JsonPropertyName("shareOutstanding")]
        public double ShareOutstanding { get; set; }
    }

    public class StockUpdateDto {

        public string? Symbol { get; set; }
        public double? MarketCapitalization { get; set; }
        public string? CompanyName { get; set; }
        public string? Sector { get; set; }
        public double? Price { get; set; }
        public string Exchange { get; set; }
        public double ShareOutstanding { get; set; }
    }

    public class StockDto
    {
        public int Id { get; set; }
        public string Symbol { get; set; }
        public string CompanyName { get; set; }
        public string? Sector { get; set; }
        public double? Price { get; set; }
        public double MarketCap { get; set; }
        public int StockDataId { get; set; }
        public string Exchange { get; set; }
        public double ShareOutstanding { get; set; }
    }
}