using InManSysWeb.Models;
using InventorySystem.Data;
using InventorySystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InManSysWeb.Controllers.API
{
    [ApiController]
    [Route("api/suppliers")]

    public class SupplierController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public SupplierController(ApplicationDbContext db) => _db = db;

        // GET: api/suppliers
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _db.Suppliers.AsNoTracking().ToListAsync());
        }

        // GET BY ID
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var sup = await _db.Suppliers.FindAsync(id);
            if (sup == null)
                return NotFound("Supplier not found");

            return Ok(sup);
        }

        // POST: api/Suppliers
        [HttpPost]
        public async Task<IActionResult> Create(Supplier supplier)
        {
            if (!ModelState.IsValid) 
                return BadRequest(ModelState);

            if (await _db.Suppliers.AnyAsync(x => x.Name == supplier.Name))
                return Conflict("Supplier name alredy exists");

            try
            {
                _db.Suppliers.Add(supplier);
                await _db.SaveChangesAsync();
            }
            catch (Exception ex) {
                return StatusCode(500, "Server error: " + ex.Message);
            }

            return Ok(supplier);
        }

        // UPDATE
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Supplier supplier)
        {
            if (id != supplier.Id)
                return BadRequest("ID mismatch");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Check duplicate (other id)
            if (await _db.Suppliers.AnyAsync(x => x.Name == supplier.Name && x.Id != id))
                return Conflict("Another Supplier with same name already exists");

            try
            {
                _db.Entry(supplier).State = EntityState.Modified;
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _db.Suppliers.AnyAsync(x => x.Id == id))
                    return NotFound("Supplier not found");

                throw;
            }

            return Ok("Updated successfully");
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var sup = await _db.Suppliers.FindAsync(id);
            if (sup == null)
                return NotFound("Supplier not found");

            try
            {
                _db.Suppliers.Remove(sup);
                await _db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                // When foreign key constraint fails
                return Conflict("Cannot delete: Supplier is in use");
            }

            return Ok("Deleted successfully");
        }
    }
}
