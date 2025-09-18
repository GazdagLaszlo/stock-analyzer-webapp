using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockManager.DataContext.DTOs;
using StockManager.Services;

namespace StockManager.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    //[Authorize]
    public class StockController(IStockService stockService, StockPriceUpdaterWebSocketService priceService) : ControllerBase
    {
        [HttpPost]
        //[Authorize(Roles = "")]
        public async Task<IActionResult> CreateAsync([FromBody] StockCreateDto stockCreateDto)
        {
            var result = await stockService.CreateAsync(stockCreateDto);
            return Ok(result);
        }

        [HttpGet]
        //[Authorize(Roles = "")]
        [ProducesResponseType<IList<StockDto>>(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllAsync()
        {
            var result = await stockService.GetAllAsync();
            return Ok(result);
        }        

        [HttpGet("{symbol}")]
        //[Authorize(Roles = "")]
        [ProducesResponseType<StockDto>(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetBySymbolAsync(string symbol)
        {
            var result = await stockService.GetBySymbolAsync(symbol);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        //[Authorize(Roles = "")]
        [ProducesResponseType<StockDto>(StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody] StockUpdateDto stockUpdateDto)
        {
            var result = await stockService.UpdateAsync(id, stockUpdateDto);
            return Ok(result);
        }

        [HttpGet]
        public IActionResult GetPrice([FromQuery] string symbol)
        {
            if (priceService.Latest.TryGetValue(symbol.ToUpperInvariant(), out var price))
                return Ok(new { symbol, price });
            return NotFound(new { error = "Nincs adat erre a szimbólumra." });
        }
    }
}
