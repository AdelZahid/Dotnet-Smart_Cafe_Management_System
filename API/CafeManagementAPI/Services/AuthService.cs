using CafeManagementAPI.Data;
using CafeManagementAPI.Dtos.Auth;
using CafeManagementAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CafeManagementAPI.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginRequestDto request);
        Task<AuthResponseDto> EmployeeLoginAsync(EmployeeLoginRequestDto request);
        Task<AuthResponseDto> GoogleLoginAsync(GoogleLoginRequestDto request);
        Task<AuthResponseDto> RegisterOwnerAsync(RegisterOwnerRequestDto request);
        Task<AuthResponseDto> RegisterEmployeeRequestAsync(EmployeeRegisterRequestDto request);
    }

    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive);

            if (user == null)
                return new AuthResponseDto { Success = false, Message = "Invalid email or password" };

            if (user.PasswordHash == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return new AuthResponseDto { Success = false, Message = "Invalid email or password" };

            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var token = await GenerateJwtTokenForUserAsync(user);
            var userInfo = await GetUserInfoAsync(user);

            return new AuthResponseDto
            {
                Success = true,
                Message = "Login successful",
                Token = token,
                User = userInfo
            };
        }

        public async Task<AuthResponseDto> EmployeeLoginAsync(EmployeeLoginRequestDto request)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e =>
                    e.Email == request.Email &&
                    e.EmployeeId == request.EmployeeId &&
                    e.IsActive);

            if (employee == null)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "Invalid email or employee ID"
                };
            }

            var role = employee.Designation == "Manager" ? "Manager" : "Waiter";
            var token = GenerateJwtTokenForEmployee(employee, role);

            return new AuthResponseDto
            {
                Success = true,
                Message = "Employee login successful",
                Token = token,
                User = new UserInfoDto
                {
                    Id = employee.Id,
                    Email = employee.Email,
                    Role = role,
                    CafeId = employee.CafeId,
                    EmployeeId = employee.EmployeeId,
                    Designation = employee.Designation
                }
            };
        }

        public async Task<AuthResponseDto> RegisterEmployeeRequestAsync(EmployeeRegisterRequestDto request)
        {
            var cafeExists = await _context.CafeProfiles.AnyAsync(c => c.Email == request.CafeEmail);
            if (!cafeExists)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "No cafe found with this shop email"
                };
            }

            var emailExistsInEmployees = await _context.Employees.AnyAsync(e => e.Email == request.Email);
            var emailExistsInRequests = await _context.EmployeeRegistrationRequests.AnyAsync(r =>
                r.Email == request.Email &&
                r.CafeEmail == request.CafeEmail &&
                r.Status == "Pending");

            if (emailExistsInEmployees || emailExistsInRequests)
            {
                return new AuthResponseDto
                {
                    Success = false,
                    Message = "This employee email is already used or waiting for approval for this cafe"
                };
            }

            var employeeRequest = new EmployeeRegistrationRequest
            {
                Name = request.Name,
                Age = request.Age,
                Sex = request.Sex,
                Email = request.Email,
                CafeEmail = request.CafeEmail,
                Phone = request.Phone,
                Address = request.Address,
                Designation = request.Designation,
                ImageUrl = request.ImageUrl,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.EmployeeRegistrationRequests.Add(employeeRequest);
            await _context.SaveChangesAsync();

            return new AuthResponseDto
            {
                Success = true,
                Message = "Employee registration request submitted successfully"
            };
        }

        public async Task<AuthResponseDto> GoogleLoginAsync(GoogleLoginRequestDto request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email && u.GoogleId == request.GoogleId);

            if (user == null)
                return new AuthResponseDto { Success = false, Message = "User not found. Please register first." };

            if (!user.IsActive)
                return new AuthResponseDto { Success = false, Message = "Account is inactive." };

            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            var token = await GenerateJwtTokenForUserAsync(user);
            var userInfo = await GetUserInfoAsync(user);

            return new AuthResponseDto
            {
                Success = true,
                Message = "Login successful",
                Token = token,
                User = userInfo
            };
        }

        public async Task<AuthResponseDto> RegisterOwnerAsync(RegisterOwnerRequestDto request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return new AuthResponseDto { Success = false, Message = "Email already registered" };

            var user = new User
            {
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = "Owner",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var cafeProfile = new CafeProfile
            {
                OwnerId = user.Id,
                CafeName = request.CafeName,
                OwnerName = request.OwnerName,
                Location = request.Location,
                Phone = request.Phone,
                Email = request.Email,
                ImageUrl = request.ImageUrl,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.CafeProfiles.Add(cafeProfile);
            await _context.SaveChangesAsync();

            for (int i = 1; i <= 10; i++)
            {
                _context.Tables.Add(new Table
                {
                    CafeId = cafeProfile.Id,
                    TableNumber = $"T{i:D2}",
                    Capacity = 4,
                    IsActive = true
                });
            }

            await _context.SaveChangesAsync();

            var token = await GenerateJwtTokenForUserAsync(user);
            var userInfo = await GetUserInfoAsync(user);

            return new AuthResponseDto
            {
                Success = true,
                Message = "Registration successful",
                Token = token,
                User = userInfo
            };
        }

        private async Task<string> GenerateJwtTokenForUserAsync(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            if (user.Role == "Owner")
            {
                var cafe = await _context.CafeProfiles.FirstOrDefaultAsync(c => c.OwnerId == user.Id);
                if (cafe != null)
                    claims.Add(new Claim("CafeId", cafe.Id.ToString()));
            }
            else
            {
                var employee = await _context.Employees.FirstOrDefaultAsync(e => e.UserId == user.Id);
                if (employee != null)
                {
                    claims.Add(new Claim("CafeId", employee.CafeId.ToString()));
                    claims.Add(new Claim("EmployeeId", employee.EmployeeId));
                }
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateJwtTokenForEmployee(Employee employee, string role)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, employee.Id.ToString()),
                new Claim(ClaimTypes.Email, employee.Email),
                new Claim(ClaimTypes.Role, role),
                new Claim("CafeId", employee.CafeId.ToString()),
                new Claim("EmployeeId", employee.EmployeeId)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private async Task<UserInfoDto> GetUserInfoAsync(User user)
        {
            if (user.Role == "Owner")
            {
                var cafe = await _context.CafeProfiles.FirstOrDefaultAsync(c => c.OwnerId == user.Id);
                return new UserInfoDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    Role = user.Role,
                    CafeName = cafe?.CafeName,
                    CafeId = cafe?.Id
                };
            }

            var employee = await _context.Employees.FirstOrDefaultAsync(e => e.UserId == user.Id);
            return new UserInfoDto
            {
                Id = user.Id,
                Email = user.Email,
                Role = user.Role,
                CafeId = employee?.CafeId,
                EmployeeId = employee?.EmployeeId,
                Designation = employee?.Designation
            };
        }
    }
}