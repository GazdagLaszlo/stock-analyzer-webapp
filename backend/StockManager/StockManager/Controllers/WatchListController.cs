using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockManager.DataContext.DTOs;
using StockManager.Services;
using System.Security.Claims;

namespace StockManager.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize]
    public class WatchListController(IWatchListService watchListService) : ControllerBase
    {
        private int _userId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        [HttpGet]
        //[Authorize(Roles = "")]
        [ProducesResponseType<WatchListDto>(StatusCodes.Status200OK)]
        public async Task<ActionResult<WatchListDto>> GetByUserIdAsync()
        {
            var result = await watchListService.GetByUserIdAsync(_userId);
            return Ok(result);
        }
    }
}
