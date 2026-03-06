namespace StockManager.DataContext.Entities
{
    public enum TransactionType
    {
        Buy,
        Sell
    }
    public class Transaction
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int StockId { get; set; }
        public Stock Stock { get; set; }
        public double Price { get; set; }
        public double Quantity { get; set; }
        public DateTime Date { get; set; }
        public TransactionType TransactionType { get; set; }
        public double? Fee { get; set; }
        public string? Note { get; set; }
        public int PortfolioItemId { get; set; }
        public PortfolioItem PortfolioItem { get; set; }
        public bool IsActive { get; set; }
        public double RealizedProfit {  get; set; }
        public Guid TradeId { get; set; }
    }
}
