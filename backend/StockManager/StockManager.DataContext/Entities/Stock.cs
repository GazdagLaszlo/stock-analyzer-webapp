namespace StockManager.DataContext.Entities
{
    public class Stock
    {
        public int Id { get; set; }
        public string? Symbol { get; set; }
        public string? CompanyName { get; set; }
        public string? Sector { get; set; }
        public StockData StockData { get; set; }
        public string? Exchange { get; set; }
        public double? ShareOutstanding { get; set; }


        //Záráskor 1x menteni
        public double? Price { get; set; }
        public double? MarketCap { get; set; }
    }
}
