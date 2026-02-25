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

public class TokenResponseDto
{
    public string AccessToken { get; set; }
}

public class UserUpdateDto
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }    
}