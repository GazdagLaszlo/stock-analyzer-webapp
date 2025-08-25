namespace StockManager.DataContext.Entities
{
    public class WatchListItem
    {
        public int Id { get; set; }
        public int StockId { get; set; }
        public Stock Stock { get; set; }
        public int WatchListId { get; set; }
        public WatchList WatchList { get; set; }
        public double EntryPrice { get; set; }
        public string? Note { get; set; }
    }    
}
