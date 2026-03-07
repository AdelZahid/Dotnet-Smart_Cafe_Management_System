using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeManagementAPI.Models
{
    public class IngredientPurchase
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Ingredient")]
        public int IngredientId { get; set; }

        public DateTime PurchaseDate { get; set; } = DateTime.UtcNow;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        [NotMapped]
        public decimal TotalCost => Quantity * UnitPrice;

        [StringLength(200)]
        public string? SupplierName { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public virtual Ingredient Ingredient { get; set; } = null!;
    }
}
