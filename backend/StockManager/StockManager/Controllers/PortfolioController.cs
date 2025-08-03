using Microsoft.AspNetCore.Mvc;

namespace StockManager.Controllers
{
    public class PortfolioController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
