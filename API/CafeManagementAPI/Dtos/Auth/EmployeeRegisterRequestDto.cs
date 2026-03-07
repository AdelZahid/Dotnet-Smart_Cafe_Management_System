using System.ComponentModel.DataAnnotations;

namespace CafeManagementAPI.Dtos.Auth
{
    public class EmployeeRegisterRequestDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        public int? Age { get; set; }

        public string? Sex { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string CafeEmail { get; set; } = string.Empty;

        public string? Phone { get; set; }

        public string? Address { get; set; }

        [Required]
        public string Designation { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }
    }
}