using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeManagementAPI.Models
{
    public class Reservation
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Cafe")]
        public int CafeId { get; set; }

        [Required]
        [ForeignKey("Table")]
        public int TableId { get; set; }

        [Required]
        [StringLength(200)]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string CustomerPhone { get; set; } = string.Empty;

        [EmailAddress]
        [StringLength(255)]
        public string? CustomerEmail { get; set; }

        [Required]
        public DateTime ReservationDate { get; set; }

        [Required]
        public TimeSpan StartTime { get; set; }

        [Required]
        public TimeSpan EndTime { get; set; }

        [Required]
        public int NumberOfGuests { get; set; } = 2;

        [StringLength(500)]
        public string? Notes { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "Confirmed"; // Confirmed, Cancelled, Completed

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual CafeProfile Cafe { get; set; } = null!;
        public virtual Table Table { get; set; } = null!;
    }
}
