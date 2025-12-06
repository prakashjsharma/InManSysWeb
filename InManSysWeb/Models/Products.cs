using InManSysWeb.Models;
using InventorySystem.Models;
using System.ComponentModel.DataAnnotations;

public class Products
{
    public int Id { get; set; }

    [Required, StringLength(150)]
    public string Name { get; set; } = string.Empty;

    [StringLength(300)]
    public string? Description { get; set; }

    [Required, StringLength(50)]
    public string ArticleNo { get; set; } = string.Empty;

    [StringLength(50)]
    public string? UPCCode { get; set; }

    public string? Image { get; set; }   // ❌ no Required

    [Required]
    public int SupplierId { get; set; }

    [Required]
    public int CategoryId { get; set; }
    public Supplier? Supplier { get; set; }
    public Category? Category { get; set; }

    public bool Status { get; set; } = true;

    [Required]
    public decimal? Width { get; set; }

    [Required]
    public decimal? Height { get; set; }

    [Required]
    public decimal? Weight { get; set; }

    [Required]
    public decimal? Depth { get; set; }

    [Required]
    public decimal Price { get; set; }

    [Required]
    public decimal? CostPrice { get; set; }

    [Required]
    public decimal? DiscountPrice { get; set; }

    [Required]
    public int? ReorderLevel { get; set; }

    [Required]
    public int? ShelfLifeDays { get; set; }

    [Required]
    public string? UnitOfMeasure { get; set; }

    public Products()
    {
        DOEntry = DateTime.Now;
        DTOEntry = DateTime.Now;
    }
    public DateTime? DOEntry { get; set; }
    public DateTime? DTOEntry { get; set; }
}
