using StockManager.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using System.Transactions;

namespace StockManager.DataContext.DTOs
{
    public class StockDataDto
    {
        public int Id { get; set; }
        public int StockId { get; set; }
        public double TenDayAverageTradingVolume { get; set; }
        public double ThreeMonthAverageTradingVolume { get; set; }
        public double YearHigh { get; set; }
        public double YearLow { get; set; }
        public double Beta { get; set; }
        public double CashFlowPerShareTTM { get; set; }
        public double DividendPerShareTTM { get; set; }
        public double CurrentDividendYieldTTM { get; set; }
        public double EpsTTM { get; set; }
        public double longTermDebtToEquityAnnual { get; set; }
        public double PriceToBookvalue { get; set; }
        public double PETTM { get; set; }
        public double PSTTM { get; set; }
        public List<StockDataItemDto> StockDataItems { get; set; } = new List<StockDataItemDto>();
    }

    public class StockDataDeserializer
    {
        public StockDataCreateDto metric { get; set; }
        public Series series { get; set; }
    }
    
    public class Series
    {
        public Dictionary<string, List<StockDataSeriesItem>> annual { get; set; }
        public Dictionary<string, List<StockDataSeriesItem>> quarterly { get; set; }
    }
    public class StockDataSeriesItem
    {
        public string period { get; set; }
        public decimal? v { get; set; }
    }
    public class StockDataCreateDto
    {
        public int StockId { get; set; }
        public DateOnly UpdatedDate { get; set; }


        [JsonPropertyName("10DayAverageTradingVolume")]
        public double? TenDayAverageTradingVolume { get; set; }
        [JsonPropertyName("3MonthAverageTradingVolume")]
        public double? ThreeMonthAverageTradingVolume { get; set; }
        [JsonPropertyName("52WeekHigh")]
        public double? YearHigh { get; set; }
        [JsonPropertyName("52WeekLow")]
        public double? YearLow { get; set; }
        [JsonPropertyName("beta")]
        public double? Beta { get; set; }
        [JsonPropertyName("cashFlowPerShareTTM")]
        public double? CashFlowPerShareTTM { get; set; }
        [JsonPropertyName("currentDividendYieldTTM")]
        public double? CurrentDividendYieldTTM { get; set; }        
        [JsonPropertyName("dividendPerShareTTM")]
        public double? DividendPerShareTTM { get; set; }
        [JsonPropertyName("epsTTM")]
        public double? EpsTTM { get; set; }
        [JsonPropertyName("longTermDebt/equityAnnual")]
        public double? longTermDebtToEquityAnnual { get; set; }
        [JsonPropertyName("pb")]
        public double? PriceToBookvalue { get; set; }
        [JsonPropertyName("peTTM")]
        public double? PETTM { get; set; }
        [JsonPropertyName("psTTM")]
        public double? PSTTM { get; set; }
        public List<StockDataItemDto> StockDataItems { get; set; } = new List<StockDataItemDto>();
    }

    public class StockDataUpdateDto
    {
        public int StockId { get; set; }      
        public DateOnly UpdatedDate { get; set; }
        public double? TenDayAverageTradingVolume { get; set; }
        public double? ThreeMonthAverageTradingVolume { get; set; }
        public double? YearHigh { get; set; }
        public double? YearLow { get; set; }
        public double? Beta { get; set; }
        public double? CashFlowPerShareTTM { get; set; }
        public double? CurrentDividendYieldTTM { get; set; }
        public double? DividendPerShareTTM { get; set; }
        public double? EpsTTM { get; set; }
        public double? longTermDebtToEquityAnnual { get; set; }
        public double? PriceToBookvalue { get; set; }
        public double? PETTM { get; set; }        
        public double? PSTTM { get; set; }
        public List<StockDataItemDto> StockDataItems { get; set; } = new List<StockDataItemDto>();
    }
}
