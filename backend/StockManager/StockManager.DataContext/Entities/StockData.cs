namespace StockManager.DataContext.Entities
{
    public class StockData
    {
        public int Id { get; set; }
        public int StockId { get; set; }
        public Stock Stock { get; set; }
        public DateTime Date { get; set; } //Napi 1x frissítés

        //Fő mutatók        
        public double? EPS { get; set; } //TTM
        public double? PriceToEarningsRatio { get; set; } //TTM
        public double? PriceToBookRatio { get; set; }
        public double? DebtToEquityRatio { get; set; }
        public double? DividendYield { get; set; }

        //Többi csoportosítva fog megjelenni
    }
}
