using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockManager.DataContext.DTOs;
using StockManager.DataContext.Entities;
using StockManager.Services;

namespace StockManager.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize]
    public class StockReportController(IStockReportService stockReportService) : ControllerBase
    {
        [HttpGet("{symbol}")]
        //[Authorize(Roles = "")]
        [ProducesResponseType(typeof(List<StockReportDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetStockReportsToSymbol(string symbol)
        {
            var result = await stockReportService.GetStockReportsBySymbol(symbol);
            return Ok(result);
        }
    }
}
