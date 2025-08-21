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
        private int UserId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] PortfolioCreateDto createDto)
        {
            await portfolioService.CreateAsync(createDto, UserId);
            return Ok();
        }

        [HttpGet]
        //[Authorize(Roles = "")]
        [ProducesResponseType<IList<PortfolioDto>>(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllAsync()
        {
            var result = await portfolioService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        //[Authorize(Roles = "")]
        [ProducesResponseType<IList<PortfolioDto>>(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var result = await portfolioService.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        //[Authorize(Roles = "")]
        [ProducesResponseType<PortfolioDto>(StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody] PortfolioUpdateDto portfolioUpdateDto)
        {
            var result = await portfolioService.UpdateAsync(id, portfolioUpdateDto);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        //[Authorize(Roles = "")]
        [ProducesResponseType<PortfolioDto>(StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            await portfolioService.DeleteAsync(id);
            return Ok();
        }
    }
}
