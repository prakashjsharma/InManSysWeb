using Microsoft.AspNetCore.Mvc;

namespace InManSysWeb.Controllers
{
    public class DashboardController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
