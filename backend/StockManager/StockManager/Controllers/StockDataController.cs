using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockManager.DataContext.DTOs;
using StockManager.Services;

namespace StockManager.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize]
    public class StockDataController(IStockDataService stockDataService) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] StockDataCreateDto createDto)
        {
            await stockDataService.CreateAsync(createDto);
            return Ok();
        }

        [HttpGet("{id:int}")]
        //[Authorize(Roles = "")]
        [ProducesResponseType<StockDataDto>(StatusCodes.Status200OK)]
        public async Task<ActionResult<StockDataDto>> GetBySymbolAsync(string symbol)
        {
            var result = await stockDataService.GetBySymbolAsync(symbol);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        //[Authorize(Roles = "")]
        [ProducesResponseType<StockDataDto>(StatusCodes.Status200OK)]
        public async Task<ActionResult<StockDataDto>> UpdateAsync(int id, [FromBody] StockDataUpdateDto stockDataUpdateDto)
        {
            var result = await stockDataService.UpdateAsync(id, stockDataUpdateDto);
            return Ok(result);
        }
    }
}
