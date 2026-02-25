using System.ComponentModel.DataAnnotations;

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
        [Required]
        public string Name { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string PasswordHash { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
        public WatchList WatchList { get; set; }
        public UserRole Role { get; set; } = UserRole.Investor;
        public List<Portfolio> Portfolios { get; set; } = new List<Portfolio>();
    }
}
