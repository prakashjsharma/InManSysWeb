using InManSysWeb.Models;
using InventorySystem.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/category")]
public class CategoryController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    public CategoryController(ApplicationDbContext db) => _db = db;


    // GET
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _db.Category.AsNoTracking().ToListAsync());
    }


    // GET BY ID
    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var cat = await _db.Category.FindAsync(id);
        if (cat == null)
            return NotFound("Category not found");

        return Ok(cat);
    }


    // CREATE
    [HttpPost]
    public async Task<IActionResult> Create(Category category)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Check duplicate
        if (await _db.Category.AnyAsync(x => x.Name == category.Name))
            return Conflict("Category name already exists");

        try
        {
            _db.Category.Add(category);
            await _db.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Server error: " + ex.Message);
        }

        return Ok(category);
    }


    // UPDATE
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Category category)
    {
        if (id != category.Id)
            return BadRequest("ID mismatch");

        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Check duplicate (other id)
        if (await _db.Category.AnyAsync(x => x.Name == category.Name && x.Id != id))
            return Conflict("Another Category with same name already exists");

        try
        {
            _db.Entry(category).State = EntityState.Modified;
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await _db.Category.AnyAsync(x => x.Id == id))
                return NotFound("Category not found");

            throw;
        }

        return Ok("Updated successfully");
    }


    // DELETE
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var cat = await _db.Category.FindAsync(id);
        if (cat == null)
            return NotFound("Category not found");

        try
        {
            _db.Category.Remove(cat);
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            // When foreign key constraint fails
            return Conflict("Cannot delete: Category is in use");
        }

        return Ok("Deleted successfully");
    }
}
