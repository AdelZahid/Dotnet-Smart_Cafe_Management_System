using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeManagementAPI.Models
{
    public class Ingredient
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Cafe")]
        public int CafeId { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string UnitOfMeasure { get; set; } = string.Empty; // kg, liter, piece, etc.

        [Column(TypeName = "decimal(18,2)")]
        public decimal CurrentStock { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal MinStockLevel { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual CafeProfile Cafe { get; set; } = null!;
        public virtual ICollection<IngredientPurchase> Purchases { get; set; } = new List<IngredientPurchase>();
        public virtual ICollection<IngredientUsage> Usages { get; set; } = new List<IngredientUsage>();
    }
}
