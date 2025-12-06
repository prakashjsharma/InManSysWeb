using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using InventorySystem.Data;
using InManSysWeb.Models;

namespace InManSysWeb.Controllers.API
{
    [Route("api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IWebHostEnvironment _env;

        public ProductsController(ApplicationDbContext db, IWebHostEnvironment env)
        {
            _db = db;
            _env = env;
        }

        // GET All
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _db.Products
            .Include(p => p.Supplier)
            .Include(p => p.Category)
            .Select(p => new {
                p.Id,
                p.Name,
                p.ArticleNo,
                p.UPCCode,
                p.Price,
                p.CostPrice,
                p.DiscountPrice,
                p.ReorderLevel,
                p.ShelfLifeDays,
                p.Weight,
                p.Height,
                p.Depth, p.Width, p.UnitOfMeasure, p.Description,
                Supplier = p.Supplier.Name,
                Category = p.Category.Name,

                p.SupplierId,
                p.CategoryId,
                p.Image,
                p.Status
            })
            .AsNoTracking()
            .ToListAsync());
        }

        // GET by ID (with includes)
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var p = await _db.Products
                .Include(x => x.Supplier)
                .Include(x => x.Category)
                .Where(x => x.Id == id)
                .Select(x => new {
                    x.Id,
                    x.Name,
                    x.Description,
                    x.ArticleNo,
                    x.UPCCode,
                    x.Image,
                    x.SupplierId,
                    Supplier = x.Supplier.Name,
                    x.CategoryId,
                    Category = x.Category.Name,
                    x.Price,
                    x.CostPrice,
                    x.DiscountPrice,
                    x.Width,
                    x.Height,
                    x.Depth,
                    x.Weight,
                    x.ReorderLevel,
                    x.ShelfLifeDays,
                    x.UnitOfMeasure,
                    x.DOEntry,
                    x.DTOEntry,
                    x.Status
                })
                .AsNoTracking()
                .FirstOrDefaultAsync();

            if (p == null) return NotFound("Product not found");
            return Ok(p);
        }


        // POST (Create)
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] Products product, IFormFile? imageFile)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var uploadFolder = Path.Combine(_env.WebRootPath, "uploads/products");

            if (!Directory.Exists(uploadFolder))
            {
                Directory.CreateDirectory(uploadFolder);
            }

            // Save image
            if (imageFile != null)
            {
                string fileName = Guid.NewGuid() + Path.GetExtension(imageFile.FileName);
                string filePath = Path.Combine(_env.WebRootPath, "uploads/products", fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await imageFile.CopyToAsync(stream);

                product.Image = "/uploads/products/" + fileName;
            }

            _db.Products.Add(product);
            await _db.SaveChangesAsync();

            return Ok(product);
        }

        // PUT (Update)
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] Products product, IFormFile? imageFile)
        {
            if (id != product.Id)
                return BadRequest("ID mismatch");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var dbProduct = await _db.Products.FindAsync(id);
            if (dbProduct == null) return NotFound("Product not found");

            // Update fields
            _db.Entry(dbProduct).CurrentValues.SetValues(product);

            // Replace image if new one uploaded
            if (imageFile != null)
            {
                string fileName = Guid.NewGuid() + Path.GetExtension(imageFile.FileName);
                string filePath = Path.Combine(_env.WebRootPath, "uploads/products", fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await imageFile.CopyToAsync(stream);

                dbProduct.Image = "/uploads/products/" + fileName;
            }

            await _db.SaveChangesAsync();

            return Ok("Updated successfully");
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var p = await _db.Products.FindAsync(id);
            if (p == null) return NotFound("Product not found");

            _db.Products.Remove(p);
            await _db.SaveChangesAsync();

            return Ok("Deleted successfully");
        }
    }
}
