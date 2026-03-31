using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockManager.DataContext.DTOs;
using StockManager.DataContext.Entities;
using StockManager.Services;
using System.Security.Claims;

namespace StockManager.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize]
    public class TransactionController(ITransactionService transactionService) : ControllerBase
    {
        private int _userId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        [HttpPost]
        public async Task<IActionResult> CreateAsync([FromBody] TransactionCreateDto createDto)
        {
            await transactionService.CreateAsync(createDto, _userId);
            return Ok();
        }

        [HttpGet]        
        [ProducesResponseType<IList<TransactionDto>>(StatusCodes.Status200OK)]
        public async Task<ActionResult<IList<TransactionDto>>> GetAllAsync(
            [FromQuery] TransactionType? type,
            [FromQuery] string? portfolioId)
        {
            var result = await transactionService.GetAllAsync(_userId, type, portfolioId);
            return Ok(result);
        }

        [HttpGet("{id:int}")]        
        [ProducesResponseType<TransactionDto>(StatusCodes.Status200OK)]
        public async Task<ActionResult<TransactionDto>> GetByIdAsync(int id)
        {
            var result = await transactionService.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpPut("{id:int}")]
        [ProducesResponseType<TransactionDto>(StatusCodes.Status200OK)]
        public async Task<ActionResult<TransactionDto>> UpdateAsync(int id, [FromBody] TransactionUpdateDto transactionUpdateDto)
        {
            var result = await transactionService.UpdateAsync(id, transactionUpdateDto);
            return Ok(result);
        }

        [HttpDelete("{id:int}")]        
        [ProducesResponseType<TransactionDto>(StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            await transactionService.DeleteAsync(id);
            return Ok();
        }        

        [HttpGet]
        public async Task<ActionResult<IList<TransactionDto>>> GetWithSameTradeId(Guid tradeId)
        {
            var result = await transactionService.GetWithSameTradeId(tradeId);
            return Ok(result);
        }
    }
}
