using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeManagementAPI.Models
{
    public class MenuItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Cafe")]
        public int CafeId { get; set; }

        [ForeignKey("Category")]
        public int? CategoryId { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        [StringLength(500)]
        public string? ImageUrl { get; set; }

        public bool IsAvailable { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Computed property for price range
        [NotMapped]
        public string PriceRange
        {
            get
            {
                if (UnitPrice < 100) return "Low";
                if (UnitPrice >= 100 && UnitPrice < 300) return "Medium";
                return "High";
            }
        }

        // Navigation properties
        public virtual CafeProfile Cafe { get; set; } = null!;
        public virtual ItemCategory? Category { get; set; }
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
