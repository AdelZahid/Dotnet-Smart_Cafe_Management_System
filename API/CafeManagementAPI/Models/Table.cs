using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeManagementAPI.Models
{
    public class Table
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Cafe")]
        public int CafeId { get; set; }

        [Required]
        [StringLength(20)]
        public string TableNumber { get; set; } = string.Empty;

        [Required]
        public int Capacity { get; set; } = 4;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual CafeProfile Cafe { get; set; } = null!;
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
        public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}
