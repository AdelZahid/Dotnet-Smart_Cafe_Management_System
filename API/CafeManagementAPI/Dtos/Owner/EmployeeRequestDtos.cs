using System;
using System.ComponentModel.DataAnnotations;

namespace CafeManagementAPI.Dtos.Owner
{
    public class EmployeeRequestResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? Age { get; set; }
        public string? Sex { get; set; }
        public string Email { get; set; } = string.Empty;
        public string CafeEmail { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string Designation { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class ApproveEmployeeRequestDto
    {
        [Required]
        public string Shift { get; set; } = string.Empty;

        [Required]
        public decimal Salary { get; set; }
    }
}