namespace StockManager.DataContext.Entities
{
    public class Portfolio
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public List<PortfolioItem> PortfolioItems { get; set; }


        //Záráskor 1x menteni
        //Kezdetben nem lesz History
        public double Value { get; set; } //In dollar
        public double ProfitLoss { get; set; } //In dollar
    }
}
