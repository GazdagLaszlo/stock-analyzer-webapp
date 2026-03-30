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
    public class PortfolioController(IPortfolioService portfolioService) : ControllerBase
    {
        private int _userId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        [HttpPost]        
        public async Task<IActionResult> CreateAsync([FromBody] PortfolioCreateDto createDto)
        {
            var result = await portfolioService.CreateAsync(createDto, _userId);
            return Ok(result);
        }

        [HttpGet]
        [ProducesResponseType<IList<PortfolioDto>>(StatusCodes.Status200OK)]

        public async Task<IActionResult> GetAllAsync()
        {            
            var result = await portfolioService.GetAllAsync(_userId);
            return Ok(result);
        }

        [HttpGet("{id:int}")]        
        [ProducesResponseType<PortfolioDto>(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var result = await portfolioService.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpPut("{id:int}")]        
        [ProducesResponseType<PortfolioDto>(StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody] PortfolioUpdateDto portfolioUpdateDto)
        {
            var result = await portfolioService.UpdateAsync(id, portfolioUpdateDto);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]        
        [ProducesResponseType<PortfolioDto>(StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            await portfolioService.DeleteAsync(id);
            return Ok();
        }
    }
}
