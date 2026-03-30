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
    public class ArticleController(IArticleService articleService) : ControllerBase
    {
        [HttpPost]
        [ProducesResponseType<ArticleDto>(StatusCodes.Status200OK)]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> CreateAsync([FromBody] ArticleCreateUpdateDto createDto)
        {
            var result = await articleService.CreateAsync(createDto);
            return Ok(result);
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType<ArticleDto>(StatusCodes.Status200OK)]        
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var result = await articleService.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpGet]
        [AllowAnonymous]
        [ProducesResponseType<IEnumerable<ArticleDto>>(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllAsync(
            [FromQuery] string? search = null,
            [FromQuery] string? topic = null)
        {
            var result = await articleService.GetAllAsync(search, topic);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        [ProducesResponseType<ArticleDto>(StatusCodes.Status200OK)]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody] ArticleCreateUpdateDto updateDto)
        {
            var result = await articleService.UpdateAsync(id, updateDto);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            await articleService.DeleteAsync(id);
            return Ok();
        }
    }
}