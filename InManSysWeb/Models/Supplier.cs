using System.ComponentModel.DataAnnotations;

namespace InventorySystem.Models
{
    public class Supplier
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Supplier Name is required"), StringLength(150)]
        public string Name { get; set; } = string.Empty;

        [StringLength(250)]
        public string? Address { get; set; }

        [Phone, StringLength(20)]
        public string? Phone { get; set; }

        [Required(ErrorMessage = "Email address is required"), EmailAddress, StringLength(150)]
        public string? Email { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
