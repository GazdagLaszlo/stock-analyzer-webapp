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

    public class StockDataMetricsDto
    {
        public decimal? TangibleBookValue { get; set; }
        public decimal? AssetTurnoverTTM { get; set; }
        public decimal? PretaxMargin { get; set; }        
        public decimal? CashRatio { get; set; }
        public decimal? TotalRatio { get; set; }
        public decimal? CurrentRatio { get; set; }
        public decimal? PtBV { get; set; }
        public decimal? EbitPerShare { get; set; }
        public decimal? Eps { get; set; }
        public decimal? Ev { get; set; }
        public decimal? EvEbitdaTTM { get; set; }         
        public decimal? FcfPerShareTTM { get; set; }
        public decimal? GrossMargin { get; set; }
        public decimal? InventoryTurnoverTTM { get; set; }
        public decimal? BookValue { get; set; }
        public decimal? LongtermDebtTotalAsset { get; set; }
        public decimal? LongtermDebtTotalCapital { get; set; }
        public decimal? LongtermDebtTotalEquity { get; set; }
        public decimal? EvRevenueTTM { get; set; }
        public decimal? QuickRatio { get; set; }
        public decimal? NetDebtToTotalCapital { get; set; }
        public decimal? NetDebtToTotalEquity { get; set; }
        public decimal? NetMargin { get; set; }
        public decimal? OperatingMargin { get; set; }        
        public decimal? Pb { get; set; }
        public decimal? PeTTM { get; set; }
        public decimal? FcfMargin { get; set; }
        public decimal? TotalDebtToTotalAsset { get; set; }
        public decimal? PfcfTTM { get; set; }        
        public decimal? PsTTM { get; set; }        
        public decimal? ReceivablesTurnoverTTM { get; set; }
        public decimal? RoaTTM { get; set; }
        public decimal? RoeTTM { get; set; }
        public decimal? RoicTTM { get; set; }
        public decimal? RotcTTM { get; set; }
        public decimal? SalesPerShare { get; set; }
        public decimal? SgaToSale { get; set; }
        public decimal? PayoutRatioTTM { get; set; }
        public decimal? TotalDebtToEquity { get; set; }        
        public decimal? TotalDebtToTotalCapital { get; set; }
    }
}
