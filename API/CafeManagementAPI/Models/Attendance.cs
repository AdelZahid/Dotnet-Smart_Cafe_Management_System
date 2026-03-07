using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeManagementAPI.Models
{
    public class Attendance
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Employee")]
        public int EmployeeId { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = string.Empty; // Present, Absent, Late, HalfDay

        public TimeSpan? CheckInTime { get; set; }

        public TimeSpan? CheckOutTime { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public virtual Employee Employee { get; set; } = null!;
    }
}
