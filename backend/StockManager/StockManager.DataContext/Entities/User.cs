namespace StockManager.DataContext.Entities
{
    public enum UserRole
    {
        Investor,
        Admin
    }

    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public WatchList WatchList { get; set; }
        public UserRole Role { get; set; } = UserRole.Investor;
        public List<Portfolio> Portfolios { get; set; }
    }
}
