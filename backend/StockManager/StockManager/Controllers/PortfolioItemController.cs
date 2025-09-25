using Microsoft.AspNetCore.Mvc;
using StockManager.DataContext.DTOs;
using StockManager.Services;
using System.Formats.Asn1;
using System.Security.Claims;

namespace StockManager.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    //[Authorize]
    public class PortfolioItemController(IPortfolioItemService portfolioItemService) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] PortfolioItemCreateDto createDto)
        {
            await portfolioItemService.CreateAsync(createDto);
            return Ok();
        }

        [HttpGet("{portfolioId:int}")]
        //[Authorize(Roles = "")]
        [ProducesResponseType<IList<PortfolioItemDto>>(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllAsync(int portfolioId)
        {
            var result = await portfolioItemService.GetAllAsync(portfolioId);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        //[Authorize(Roles = "")]
        [ProducesResponseType<PortfolioItemDto>(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var result = await portfolioItemService.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        //[Authorize(Roles = "")]
        [ProducesResponseType<PortfolioItemDto>(StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody] PortfolioItemUpdateDto portfolioItemUpdateDto)
        {
            var result = await portfolioItemService.UpdateAsync(id, portfolioItemUpdateDto);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        //[Authorize(Roles = "")]
        [ProducesResponseType<PortfolioItemDto>(StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            await portfolioItemService.DeleteAsync(id);
            return Ok();
        }

        [HttpGet("{portfolioItemId:int}")]
        public async Task<IActionResult> GetPortfolioItemProfitAsync(int portfolioItemId)
        {
            var result = await portfolioItemService.GetPortfolioItemProfitAsync(portfolioItemId);
            return Ok(result);
        }
    }
}
