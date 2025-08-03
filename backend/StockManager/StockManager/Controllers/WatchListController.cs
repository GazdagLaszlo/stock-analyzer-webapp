using Microsoft.AspNetCore.Mvc;

namespace StockManager.Controllers
{
    public class WatchListController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
