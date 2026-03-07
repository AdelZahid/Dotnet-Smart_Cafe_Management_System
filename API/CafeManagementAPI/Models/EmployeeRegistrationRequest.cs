using System.ComponentModel.DataAnnotations;

namespace CafeManagementAPI.Models
{
    public class EmployeeRegistrationRequest
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        public int? Age { get; set; }

        [StringLength(20)]
        public string? Sex { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string CafeEmail { get; set; } = string.Empty;

        [StringLength(50)]
        public string? Phone { get; set; }

        [StringLength(500)]
        public string? Address { get; set; }

        [Required]
        [StringLength(100)]
        public string Designation { get; set; } = string.Empty;

        [StringLength(500)]
        public string? ImageUrl { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Pending";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ApprovedAt { get; set; }
        public DateTime? RejectedAt { get; set; }
    }
}