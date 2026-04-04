using System.ComponentModel.DataAnnotations;

namespace CafeManagementAPI.Dtos.Auth
{
    public class RegisterEmployeeRequestDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Range(1, int.MaxValue)]
        public int CafeId { get; set; }

        [Required]
        public string Role { get; set; } = "Waiter";

        public string? Name { get; set; }
    }
}

