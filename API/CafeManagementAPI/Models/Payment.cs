using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeManagementAPI.Models
{
    public class Payment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Order")]
        public int OrderId { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        [StringLength(50)]
        public string PaymentMethod { get; set; } = string.Empty; // Cash, Card, Mobile Banking, Online

        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;

        [StringLength(100)]
        public string? TransactionId { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public virtual Order Order { get; set; } = null!;
    }
}
