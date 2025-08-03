using Microsoft.AspNetCore.Mvc;

namespace StockManager.Controllers
{
    public class StockController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
