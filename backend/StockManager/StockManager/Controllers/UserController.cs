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
    //[Authorize]
    [ProducesResponseType<UserDto>(StatusCodes.Status200OK)]
    public async Task<IActionResult> Me()
    {
        var me = await userService.Me(UserId);
        return Ok(me);
    }

    [HttpPost]
    [AllowAnonymous]
    [ProducesResponseType<LoginResponse>(StatusCodes.Status200OK)]
    public async Task<IActionResult> Login([FromBody] UserLoginDto userDto)
    {
        try
        {
            return Ok(new LoginResponse
            {
                Token = await userService.LoginAsync(userDto)
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = ex.Message });
        }
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
    //[Authorize]
    [ProducesResponseType<IEnumerable<UserDto>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllUsers()
    {
        var order = await userService.GetAllUsersAsync();
        return Ok(order);
    }

    [HttpPut("{id}")]
    //[Authorize(Roles = "Administrator")]
    [ProducesResponseType<UserDto>(StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto userUpdateDto)
    {
        var result = await userService.UpdateUserAsync(id, userUpdateDto);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    //[Authorize(Roles = "Administrator")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        await userService.DeleteUserAsync(id);
        return Ok();
    }
}