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
    public class WatchListItemController(IWatchListItemService watchListItemService) : ControllerBase
    {
        private int _userId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] WatchListItemCreateDto createDto)
        {
            await watchListItemService.CreateAsync(createDto, _userId);
            return Ok();
        }

        [HttpGet("{id:int}")]        
        [ProducesResponseType<WatchListItemDto>(StatusCodes.Status200OK)]
        public async Task<ActionResult<WatchListItemDto>> GetByIdAsync(int id)
        {
            var result = await watchListItemService.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpPut("{id:int}")]        
        [ProducesResponseType<WatchListItemDto>(StatusCodes.Status200OK)]
        public async Task<ActionResult<WatchListItemDto>> UpdateAsync(int id, [FromBody] WatchListItemUpdateDto watchListItemUpdateDto)
        {
            var result = await watchListItemService.UpdateAsync(id, watchListItemUpdateDto);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]        
        [ProducesResponseType<WatchListItemDto>(StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            await watchListItemService.DeleteAsync(id);
            return Ok();
        }
    }
}
