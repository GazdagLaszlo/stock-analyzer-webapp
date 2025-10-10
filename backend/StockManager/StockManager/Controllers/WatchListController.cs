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
        //Visszaállítani!
        private int _userId = 3; /*=> int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value)*/

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
