namespace StockManager.DataContext.Entities
{
    public class Portfolio
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public string Name { get; set; }
        public List<PortfolioItem> PortfolioItems { get; set; } = new List<PortfolioItem>();

        //Záráskor 1x menteni
        //Kezdetben nem lesz History
        public decimal? Value { get; set; } //In dollar
        public decimal? ProfitLoss { get; set; } //In dollar
    }
}
