namespace StockManager.Entities
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
        public Stock Stock { get; set; }
        public double Price { get; set; }
        public DateTime Date { get; set; }
        public TransactionType TransactionType { get; set; }
        public double Fee { get; set; }
        public string Note { get; set; }
    }
}
