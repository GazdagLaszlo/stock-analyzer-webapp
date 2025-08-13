using StockManager.DataContext.Entities;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace StockManager.DataContext.DTOs;

public class UserDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
}
    /*
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public WatchList WatchList { get; set; }
    public UserRole Role { get; set; } = UserRole.Investor;
    public List<Portfolio> Portfolios { get; set; }
    */

public class UserCreateDto
{
    [Required]
    [StringLength(50)]
    public string Name { get; set; }
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    [Required]
    [MinLength(8)]
    public string Password { get; set; }
}

public class UserLoginDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    public string Password { get; set; }
}

public class LoginResponse
{
    public string Token { get; set; }
}

public class UserUpdateDto
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }    
}