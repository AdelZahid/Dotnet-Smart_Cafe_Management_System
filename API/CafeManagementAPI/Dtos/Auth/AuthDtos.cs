namespace CafeManagementAPI.Dtos.Auth
{
    public class LoginRequestDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class GoogleLoginRequestDto
    {
        public string Email { get; set; } = string.Empty;
        public string GoogleId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }

    public class RegisterOwnerRequestDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string CafeName { get; set; } = string.Empty;
        public string OwnerName { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class AuthResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public UserInfoDto? User { get; set; }
    }

    
    public class UserInfoDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? CafeName { get; set; }
        public int? CafeId { get; set; }
        public string? EmployeeId { get; set; }
        public string? Designation { get; set; }
    }
}
