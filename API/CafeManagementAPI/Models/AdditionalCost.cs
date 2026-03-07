using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeManagementAPI.Models
{
    public class AdditionalCost
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Cafe")]
        public int CafeId { get; set; }

        [Required]
        [StringLength(100)]
        public string CostType { get; set; } = string.Empty; // Electricity, Gas, Rent, etc.

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        public DateTime CostDate { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        public bool IsRecurring { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public virtual CafeProfile Cafe { get; set; } = null!;
    }
}
