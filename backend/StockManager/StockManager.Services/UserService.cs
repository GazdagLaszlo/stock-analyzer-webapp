using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AutoMapper;
using StockManager.DataContext.Context;
using StockManager.DataContext.DTOs;
using StockManager.DataContext.Entities;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Numerics;

namespace StockManager.Services;

public interface IUserService
{
    Task<UserDto> RegisterAsync(UserCreateDto userDto);
    Task<string> LoginAsync(UserLoginDto userDto);
    Task<UserUpdateDto> UpdateUserAsync(int userId, UserUpdateDto userDto);
    Task<IList<UserDto>> GetAllUsersAsync();
    Task DeleteUserAsync(int userId);
    Task<UserDto> Me(int userId);
}

public class UserService(AppDbContext context, IMapper mapper) : IUserService
{       
    public async Task<string> LoginAsync(UserLoginDto userLoginDto)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(x => x.Email == userLoginDto.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(userLoginDto.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password!");
        }

        return await GenerateToken(user);
    }
    
    private async Task<string> GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("randomSztring12345_x2____randomSztring12345_x2"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.Now.AddDays(Convert.ToDouble(5));

        var id = await GetClaimsIdentity(user);
        var token = new JwtSecurityToken("https://localhost:5160", "https://localhost:5160", id.Claims, expires: expires, signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
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

    public async Task<UserUpdateDto> UpdateUserAsync(int userId, UserUpdateDto userUpdateDto)
    {
        var user = await context.Users
            .FirstOrDefaultAsync(x => x.Id == userId);
        if (user == null)
        {
            throw new KeyNotFoundException($"User not found with id: {userId}");
        }

        mapper.Map<User>(userUpdateDto);

        context.Users.Update(user);
        await context.SaveChangesAsync();

        return userUpdateDto;
    }

    public async Task DeleteUserAsync(int userId)
    {
        var user = context.Users
            .FirstOrDefault(x => x.Id == userId);
        if (user == null)
        {
            throw new KeyNotFoundException($"User not found with id: {userId}");
        }
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