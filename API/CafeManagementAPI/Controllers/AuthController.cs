using CafeManagementAPI.Dtos.Auth;
using CafeManagementAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace CafeManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            var response = await _authService.LoginAsync(request);
            if (!response.Success)
                return Unauthorized(response);

            return Ok(response);
        }

        [HttpPost("employee-login")]
        public async Task<IActionResult> EmployeeLogin([FromBody] EmployeeLoginRequestDto request)
        {
            var response = await _authService.EmployeeLoginAsync(request);
            if (!response.Success)
                return Unauthorized(response);

            return Ok(response);
        }

        [HttpPost("employee-register-request")]
        public async Task<IActionResult> EmployeeRegisterRequest([FromBody] EmployeeRegisterRequestDto request)
        {
            var response = await _authService.RegisterEmployeeRequestAsync(request);
            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequestDto request)
        {
            var response = await _authService.GoogleLoginAsync(request);
            if (!response.Success)
                return Unauthorized(response);

            return Ok(response);
        }

        [HttpPost("register-owner")]
        public async Task<IActionResult> RegisterOwner([FromBody] RegisterOwnerRequestDto request)
        {
            var response = await _authService.RegisterOwnerAsync(request);
            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterOwnerRequestDto request)
        {
            var response = await _authService.RegisterOwnerAsync(request);
            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }

        [HttpPost("register-employee")]
        public async Task<IActionResult> RegisterEmployee([FromBody] RegisterEmployeeRequestDto request)
        {
            var response = await _authService.RegisterEmployeeAsync(request);
            if (!response.Success)
                return BadRequest(response);

            return Ok(response);
        }
    }
}