using Microsoft.AspNetCore.Mvc;

namespace InManSysWeb.Controllers
{
    public class CategoryController : Controller
    {
        // Index value will use AJAX to talk with api/Suppliers
        public IActionResult Index()
        {
            return View();
        }
    }
}
