using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InventorySystem.Data;

namespace InManSysWeb.Controllers.API
{
    [Route("api/dashboard")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public DashboardController(ApplicationDbContext db) => _db = db;

        // GET api/dashboard/kpi
        [HttpGet("kpi")]
        public async Task<IActionResult> GetKpi()
        {
            var totals = new
            {
                TotalSuppliers = await _db.Suppliers.CountAsync(),
                TotalCategories = await _db.Category.CountAsync(),
                TotalProducts = await _db.Products.CountAsync()
            };

            return Ok(totals);
        }

        // GET api/dashboard/products-by-supplier
        [HttpGet("products-by-supplier")]
        public async Task<IActionResult> ProductsBySupplier()
        {
            var data = await _db.Suppliers
            .Select(s => new {
            Supplier = s.Name,
            Count = _db.Products.Count(p => p.SupplierId == s.Id)
        })
        .ToListAsync();

            return Ok(data);
        }

        // GET api/dashboard/products-by-category
        [HttpGet("products-by-category")]
        public async Task<IActionResult> ProductsByCategory()
        {
            var data = await _db.Category
        .Select(c => new {
            Category = c.Name,
            Count = _db.Products.Count(p => p.CategoryId == c.Id)
        })
        .ToListAsync();

            return Ok(data);
        }

        // Optional: server-side datatable source (products with supplier & category)
        // GET api/dashboard/products-table
        [HttpGet("products-table")]
        public async Task<IActionResult> ProductsTable()
        {
            var list = await _db.Products
                .Include(p => p.Supplier)
                .Include(p => p.Category)
                .Select(p => new {
                    p.Id,
                    p.Name,
                    p.ArticleNo,
                    p.UPCCode,
                    Supplier = p.Supplier.Name,
                    Category = p.Category.Name,
                    p.Price,
                    p.Image,
                    p.Status
                })
                .AsNoTracking()
                .ToListAsync();

            return Ok(list);
        }
    }
}
