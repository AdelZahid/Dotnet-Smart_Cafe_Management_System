using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeManagementAPI.Models
{
    public class SalaryPayment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Employee")]
        public int EmployeeId { get; set; }

        [Required]
        [Range(1, 12)]
        public int Month { get; set; }

        [Required]
        public int Year { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        public bool IsPaid { get; set; } = false;

        public DateTime? PaidDate { get; set; }

        [StringLength(50)]
        public string? PaymentMethod { get; set; } // Cash, Bank Transfer, Mobile Banking

        [StringLength(500)]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public virtual Employee Employee { get; set; } = null!;
    }
}
