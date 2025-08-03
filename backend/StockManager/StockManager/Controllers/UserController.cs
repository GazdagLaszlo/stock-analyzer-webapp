using Microsoft.AspNetCore.Mvc;

namespace StockManager.Controllers
{
    public class UserController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
