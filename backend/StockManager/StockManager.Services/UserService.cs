using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StockManager.DataContext.Context;
using StockManager.DataContext.DTOs;
using StockManager.DataContext.Entities;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Numerics;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace StockManager.Services;

public interface IUserService
{
    Task<UserDto> RegisterAsync(UserCreateDto userDto);
    Task<TokenResponseDto> LoginAsync(UserLoginDto userDto, HttpResponse response);
    Task<TokenResponseDto> RefreshTokenAsync(HttpRequest request, HttpResponse response);
    Task LogoutAsync(HttpRequest request, HttpResponse response);
    Task<UserDto> UpdateUserAsync(int userId, UserUpdateDto userDto);
    Task<IList<UserDto>> GetAllUsersAsync();
    Task DeleteUserAsync(int userId);
    Task<UserDto> Me(int userId);
}

public class UserService(AppDbContext context, IMapper mapper) : IUserService
{       
    public async Task<TokenResponseDto> LoginAsync(UserLoginDto userLoginDto, HttpResponse response)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(x => x.Email == userLoginDto.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(userLoginDto.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password!");
        }

        var accessToken = await GenerateAccessToken(user);
        var refreshToken = await GenerateRefreshToken(user);

        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await context.SaveChangesAsync();

        response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            //Cross-site kérések miatt None a fejlesztés ideje alatt
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddDays(7)
        });

        return new TokenResponseDto
        {
            AccessToken = accessToken
        };
    }
    public async Task<TokenResponseDto> RefreshTokenAsync(HttpRequest request, HttpResponse response)
    {
        var refreshToken = request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refreshToken)) throw new UnauthorizedAccessException();

        var user = await context.Users.FirstOrDefaultAsync(x => x.RefreshToken == refreshToken);

        if (user == null || user.RefreshTokenExpiryTime <= DateTime.UtcNow)
            throw new UnauthorizedAccessException();

        var newAccessToken = await GenerateAccessToken(user);
        var newRefreshToken = await GenerateRefreshToken(user);

        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
        await context.SaveChangesAsync();

        response.Cookies.Append("refreshToken", newRefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            //Cross-site kérések miatt None a fejlesztés ideje alatt
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddDays(7),
        });

        return new TokenResponseDto { AccessToken = newAccessToken };
    }
    private async Task<string> GenerateAccessToken(User user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes("randomSztring12345_x2____randomSztring12345_x2"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddMinutes(15);

        var id = await GetClaimsIdentity(user);
        var token = new JwtSecurityToken(
            issuer: "https://localhost:7024",
            audience: "https://localhost:7024",
            claims: id.Claims,
            expires: expires,
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task LogoutAsync(HttpRequest request, HttpResponse response)
    {
        var refreshToken = request.Cookies["refreshToken"];
        if (!string.IsNullOrEmpty(refreshToken))
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
            if (user != null)
            {
                user.RefreshToken = null;
                user.RefreshTokenExpiryTime = null;
                await context.SaveChangesAsync();
            }
        }

        response.Cookies.Delete("refreshToken");
    }
    private async Task<string> GenerateRefreshToken(User user)
    {
        var randomBytes = new byte[64];
        using var randomGenerator = RandomNumberGenerator.Create();
        randomGenerator.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    private async Task<ClaimsIdentity> GetClaimsIdentity(User user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Name),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role.ToString()),
            new(ClaimTypes.Sid, Guid.NewGuid().ToString()),
            new(JwtRegisteredClaimNames.AuthTime, DateTime.Now.ToString(CultureInfo.InvariantCulture))
        };

        return new ClaimsIdentity(claims, "Token");
    }    

    public async Task<UserDto> RegisterAsync(UserCreateDto userCreateDto)
    {
        var emailAlreadyInUse = await context.Users
            .AnyAsync(x => x.Email == userCreateDto.Email);
        if (emailAlreadyInUse)
        {
            throw new Exception($"The given email address is already in use.");
        }

        var user = mapper.Map<User>(userCreateDto);
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(userCreateDto.Password);
        user.WatchList = new WatchList();

        await context.Users.AddAsync(user);

        await context.SaveChangesAsync();
        return mapper.Map<UserDto>(user);
    }

    public async Task<IList<UserDto>> GetAllUsersAsync()
    {
        var users = await context.Users
                .ToListAsync();
        return mapper.Map<IList<UserDto>>(users);
    }

    public async Task<UserDto> UpdateUserAsync(int userId, UserUpdateDto userUpdateDto)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(x => x.Id == userId);
        if (user == null)
        {
            throw new KeyNotFoundException($"User not found with id: {userId}");
        }

        mapper.Map(userUpdateDto, user);

        await context.SaveChangesAsync();

        return mapper.Map<UserDto>(user);
    }

    public async Task DeleteUserAsync(int userId)
    {
        var user = context.Users
            .FirstOrDefault(x => x.Id == userId);
        if (user == null)
        {
            throw new KeyNotFoundException($"User not found with id: {userId}");
        }

        var watchlist = await context.WatchLists
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (watchlist == null)
        {
            throw new KeyNotFoundException($"Watchlist not found with id: {watchlist.Id}");
        }

        context.WatchLists.Remove(watchlist);
        context.Users.Remove(user);
        await context.SaveChangesAsync();
    }

    public async Task<UserDto> Me(int userId)
    {
        var user = await context.Users
            .FirstAsync(x => x.Id == userId);

        if (user == null)
        {
            throw new KeyNotFoundException($"User not found with id: {userId}");
        }

        return mapper.Map<UserDto>(user);
    }
}