using Microsoft.AspNetCore.Mvc;

namespace StockManager.Controllers
{
    public class TransactionController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
