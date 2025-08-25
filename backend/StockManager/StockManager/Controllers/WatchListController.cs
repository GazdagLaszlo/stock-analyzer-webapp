using Microsoft.AspNetCore.Mvc;
using StockManager.DataContext.DTOs;
using StockManager.Services;

namespace StockManager.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    //[Authorize]
    public class WatchListController(IWatchListService watchListService) : ControllerBase
    {
        [HttpGet("{id:int}")]
        //[Authorize(Roles = "")]
        [ProducesResponseType<WatchListDto>(StatusCodes.Status200OK)]
        public async Task<ActionResult<WatchListDto>> GetByIdAsync(int id)
        {
            var result = await watchListService.GetByIdAsync(id);
            return Ok(result);
        }
    }
}
