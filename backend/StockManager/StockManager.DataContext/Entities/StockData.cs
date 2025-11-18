namespace StockManager.DataContext.Entities
{
    public class StockData
    {
        public int Id { get; set; }
        public int StockId { get; set; }
        public Stock Stock { get; set; }
        public DateOnly UpdatedDate { get; set; } //Napi 1x frissítés
        public double TenDayAverageTradingVolume { get; set; }
        public double ThreeMonthAverageTradingVolume { get; set; }
        public double YearHigh { get; set; }
        public double YearLow { get; set; }
        public double Beta { get; set; }
        public double CashFlowPerShareTTM { get; set; }
        public double CurrentDividendYieldTTM { get; set; }
        public double DividendPerShareTTM { get; set; }
        public double EpsTTM { get; set; }
        public double longTermDebtToEquityAnnual { get; set; }
        public double PriceToBookvalue { get; set; }
        public double PETTM { get; set; }
        public double PSTTM { get; set; }
        public List<StockDataItem> StockDataItems { get; set; }
    }
}
