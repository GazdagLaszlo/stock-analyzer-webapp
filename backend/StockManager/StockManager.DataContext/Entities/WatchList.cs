namespace StockManager.DataContext.Entities
{
    public class WatchList
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public List<WatchListItem> WatchListItems { get; set; } = new List<WatchListItem>();
    }
}
