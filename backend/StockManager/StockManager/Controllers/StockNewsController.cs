using Microsoft.AspNetCore.Mvc;
using StockManager.DataContext.DTOs;
using StockManager.DataContext.Entities;
using StockManager.Services;
using System.Collections.Generic;

namespace StockManager.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    //[Authorize]
    public class StockNewsController(IStockNewsService stockNewsService) : ControllerBase
    {
        [HttpGet]
        //[Authorize(Roles = "")]
        [ProducesResponseType(typeof(List<StockNews>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetNews()
        {
            var result = await stockNewsService.GetNews();
            return Ok(result);
        }
    }
}
