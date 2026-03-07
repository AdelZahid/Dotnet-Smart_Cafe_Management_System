using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeManagementAPI.Models
{
    public class OrderItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Order")]
        public int OrderId { get; set; }

        [Required]
        [ForeignKey("MenuItem")]
        public int MenuItemId { get; set; }

        [Required]
        public int Quantity { get; set; } = 1;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        [NotMapped]
        public decimal TotalPrice => Quantity * UnitPrice;

        [StringLength(500)]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual Order Order { get; set; } = null!;
        public virtual MenuItem MenuItem { get; set; } = null!;
    }
}
