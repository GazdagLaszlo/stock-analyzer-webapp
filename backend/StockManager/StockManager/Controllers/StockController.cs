using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockManager.DataContext.DTOs;
using StockManager.Services;

namespace StockManager.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    //[Authorize]
    public class StockController(IStockService stockService) : ControllerBase
    {
        [HttpPost]
        //[Authorize(Roles = "")]
        public async Task<IActionResult> CreateAsync([FromBody] StockCreateDto stockCreateDto)
        {
            await stockService.CreateAsync(stockCreateDto);
            return Ok();
        }

        [HttpGet]
        //[Authorize(Roles = "")]
        [ProducesResponseType<IList<StockDto>>(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllAsync()
        {
            var result = await stockService.GetAllAsync();
            return Ok(result);
        }        

        [HttpGet("{id:int}")]
        //[Authorize(Roles = "")]
        [ProducesResponseType<StockDto>(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var result = await stockService.GetByIdAsync(id);
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
    }
}
