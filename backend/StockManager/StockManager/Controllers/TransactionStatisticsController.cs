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
    public class TransactionStatisticsController : ControllerBase
    {
        private readonly ITransactionStatisticsService _transactionStatisticsService;
        private int _userId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        public TransactionStatisticsController(ITransactionStatisticsService transactionStatisticsService) 
        {
            _transactionStatisticsService = transactionStatisticsService;
        }

        [HttpGet]
        [ProducesResponseType<TradeSummaryDto>(StatusCodes.Status200OK)]
        public async Task<ActionResult<TradeSummaryDto>> GetTransactionsSummary()
        {
            var result = await _transactionStatisticsService.GetTransactionsSummary(_userId);
            return Ok(result);
        }

        [HttpGet]
        [ProducesResponseType<List<TradeInsightDto>>(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<TradeInsightDto>>> GetTradeInsight()
        {
            var result = await _transactionStatisticsService.GetTradeInsight(_userId);
            return Ok(result);
        }
    }
}
