using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeManagementAPI.Models
{
    public class IngredientUsage
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Ingredient")]
        public int IngredientId { get; set; }

        public DateTime UsageDate { get; set; } = DateTime.UtcNow;

        [Column(TypeName = "decimal(18,2)")]
        public decimal QuantityUsed { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal QuantityWasted { get; set; } = 0;

        [StringLength(500)]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public virtual Ingredient Ingredient { get; set; } = null!;
    }
}
