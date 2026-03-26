using System.Security.Claims;
using StockManager.DataContext.DTOs;
using StockManager.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockManager.DataContext.DTOs;
using StockManager.Services;


namespace StockManager.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
[Authorize]
public class UserController(IUserService userService) : ControllerBase
{
    private int UserId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

    [HttpGet]
    [Authorize]
    [ProducesResponseType<UserDto>(StatusCodes.Status200OK)]
    public async Task<IActionResult> Me()
    {
        var me = await userService.Me(UserId);
        return Ok(me);
    }

    [HttpPost]
    [AllowAnonymous]
    [ProducesResponseType<TokenResponseDto>(StatusCodes.Status200OK)]
    public async Task<IActionResult> Login([FromBody] UserLoginDto userDto)
    {
        try
        {
            var tokenResponse = await userService.LoginAsync(userDto, Response);
            return Ok(tokenResponse);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
    }

    [HttpPost]
    [AllowAnonymous]
    [ProducesResponseType<TokenResponseDto>(StatusCodes.Status200OK)]
    public async Task<IActionResult> RefreshToken()
    {
        try
        {
            var tokenResponse = await userService.RefreshTokenAsync(Request, Response);
            return Ok(tokenResponse);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(new { message = "Invalid or expired refresh token." });
        }
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        await userService.LogoutAsync(Request, Response);
        return Ok(new { message = "Logged out successfully." });
    }

    [HttpPost]
    [AllowAnonymous]
    [ProducesResponseType<UserDto>(StatusCodes.Status200OK)]
    public async Task<IActionResult> Register([FromBody] UserCreateDto userCreateDto)
    {
        var result = await userService.RegisterAsync(userCreateDto);
        return Ok(result);
    }

    [HttpGet]
    [Authorize(Roles = "Administrator")]
    [ProducesResponseType<IEnumerable<UserDto>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllUsers()
    {
        var order = await userService.GetAllUsersAsync();
        return Ok(order);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Administrator")]
    [ProducesResponseType<UserDto>(StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto userUpdateDto)
    {
        var result = await userService.UpdateUserAsync(id, userUpdateDto);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        await userService.DeleteUserAsync(id);
        return Ok(new { message = "User deleted successfully." });
    }

    [HttpPut]        
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        try
        {
            await userService.ChangePassword(UserId, dto);
            return Ok();
        } catch (InvalidOperationException ex)
        {
            return Unauthorized(new {message=ex.Message});
        }catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}