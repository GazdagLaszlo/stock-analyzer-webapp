namespace StockManager.Entities
{
    public class PortfolioItem
    {
        public int Id { get; set; }
        public int PortfolioId { get; set; }
        public Stock Stock { get; set; }
        public double Quantity { get; set; }
        public double PurchasePrice { get; set; } //átlagos vételi ár
        public double TargetPrice { get; set; }
        public string Note { get; set; }
        public double ProfitLoss { get; set; } //In dollar
    }
}
