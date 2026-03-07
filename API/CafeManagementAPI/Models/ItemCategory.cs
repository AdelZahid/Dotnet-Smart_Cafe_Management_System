using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeManagementAPI.Models
{
    public class ItemCategory
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Cafe")]
        public int CafeId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual CafeProfile Cafe { get; set; } = null!;
        public virtual ICollection<MenuItem> MenuItems { get; set; } = new List<MenuItem>();
    }
}
