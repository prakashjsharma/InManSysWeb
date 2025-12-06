using System.ComponentModel.DataAnnotations;

namespace InManSysWeb.Models
{
    public class Category
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Category Name is required"), StringLength(150)]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required"), StringLength(500)]
        public string Description { get; set; } = string.Empty;
    }
}
