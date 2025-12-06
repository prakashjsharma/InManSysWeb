using Microsoft.AspNetCore.Mvc;

namespace InManSysWeb.Controllers
{
    public class ProductsController : Controller
    {
        // Index value will use AJAX to talk with api/Suppliers
        public IActionResult Index()
        {
            return View();
        }
    }
}
