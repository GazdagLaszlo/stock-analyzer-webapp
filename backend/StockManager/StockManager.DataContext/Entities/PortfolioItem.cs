namespace StockManager.DataContext.Entities
{
    public class PortfolioItem
    {
        public int Id { get; set; }
        public Portfolio Portfolio { get; set; }
        public int PortfolioId { get; set; }
        public Stock Stock { get; set; }
        public int StockId { get; set; }
        public double Quantity { get; set; }

        //Nem biztos, hogy kelleni fog. Mindig dinamikusan számolandó.
        public double AveragePurchasePrice { get; set; } //Átlagos
        public double? TargetPrice { get; set; }
        public string? Note { get; set; }

        //Nem biztos, hogy kelleni fog. Mindig dinamikusan számolandó.
        //public double ProfitLoss { get; set; } //In dollar

        public List<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
