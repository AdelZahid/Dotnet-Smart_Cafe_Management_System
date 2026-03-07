using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeManagementAPI.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Cafe")]
        public int CafeId { get; set; }

        [ForeignKey("Table")]
        public int? TableId { get; set; }

        [ForeignKey("Waiter")]
        public int? WaiterId { get; set; }

        [Required]
        [StringLength(20)]
        public string OrderType { get; set; } = string.Empty; // DineIn, Online, Takeaway

        [StringLength(200)]
        public string? CustomerName { get; set; }

        [StringLength(50)]
        public string? CustomerPhone { get; set; }

        [StringLength(500)]
        public string? CustomerAddress { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        [StringLength(20)]
        public string Status { get; set; } = "Pending"; // Pending, Processing, Ready, Served, Cancelled, Refunded

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; } = 0;

        public bool IsPaid { get; set; } = false;

        [StringLength(500)]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual CafeProfile Cafe { get; set; } = null!;
        public virtual Table? Table { get; set; }
        public virtual Employee? Waiter { get; set; }
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
    }
}
