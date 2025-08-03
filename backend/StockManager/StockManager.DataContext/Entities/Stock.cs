namespace StockManager.Entities
{
    public class Stock
    {
        public int Id { get; set; }
        public string Ticker { get; set; }
        public string CompanyName { get; set; }


        //Lehetne enum?
        public string Sector { get; set; }
        public StockData StockData { get; set; }


        //Záráskor 1x menteni
        public double Price { get; set; }
        public double MarketCap { get; set; }
    }
}
