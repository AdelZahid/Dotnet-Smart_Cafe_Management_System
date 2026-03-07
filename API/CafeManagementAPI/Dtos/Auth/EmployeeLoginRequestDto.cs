using System.ComponentModel.DataAnnotations;

namespace CafeManagementAPI.Dtos.Auth
{
    public class EmployeeLoginRequestDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string EmployeeId { get; set; } = string.Empty;
    }
}