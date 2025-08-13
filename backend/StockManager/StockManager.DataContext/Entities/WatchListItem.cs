namespace StockManager.DataContext.Entities
{
    public class WatchListItem
    {
        public int Id { get; set; }
        public Stock Stock { get; set; }
        public double EntryPrice { get; set; }
        public string Note { get; set; }
    }
}
