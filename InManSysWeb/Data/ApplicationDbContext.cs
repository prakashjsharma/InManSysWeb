using Microsoft.EntityFrameworkCore;
using InventorySystem.Models;
using InManSysWeb.Models;

namespace InventorySystem.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Supplier> Suppliers { get; set; } = null!;
        public DbSet<Category> Category { get; set; } = null!;
        public DbSet<Products> Products { get; set; } = null!;
    }
}
