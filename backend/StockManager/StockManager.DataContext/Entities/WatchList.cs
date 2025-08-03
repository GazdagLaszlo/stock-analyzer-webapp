namespace StockManager.Entities
{
    public class WatchList
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public List<WatchListItem> WatchListItems { get; set; }
    }
}
