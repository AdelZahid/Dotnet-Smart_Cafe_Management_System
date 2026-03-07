using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeManagementAPI.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        [StringLength(500)]
        public string? PasswordHash { get; set; }

        [StringLength(255)]
        public string? GoogleId { get; set; }

        [Required]
        [StringLength(50)]
        public string Role { get; set; } = string.Empty; // Owner, Manager, Waiter

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LastLoginAt { get; set; }

        // Navigation properties
        public virtual CafeProfile? CafeProfile { get; set; }
        public virtual Employee? Employee { get; set; }
    }
}
