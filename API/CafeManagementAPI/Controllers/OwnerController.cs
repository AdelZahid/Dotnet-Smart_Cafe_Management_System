using CafeManagementAPI.Dtos.Owner;
using CafeManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CafeManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Owner")]
    public class OwnerController : ControllerBase
    {
        private readonly IOwnerService _ownerService;

        public OwnerController(IOwnerService ownerService)
        {
            _ownerService = ownerService;
        }

        private int GetCafeId()
        {
            var cafeIdClaim = User.FindFirst("CafeId")?.Value;

            if (string.IsNullOrEmpty(cafeIdClaim))
            {
                throw new InvalidOperationException("CafeId not found in token");
            }

            return int.Parse(cafeIdClaim);
        }

        #region Dashboard

        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardSummary([FromQuery] DateRangeRequestDto request)
        {
            try
            {
                var cafeId = GetCafeId();
                var summary = await _ownerService.GetDashboardSummaryAsync(cafeId, request);
                return Ok(summary);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion

        #region Employee Requests

        [HttpGet("employee-requests")]
        public async Task<IActionResult> GetPendingEmployeeRequests()
        {
            try
            {
                var cafeId = GetCafeId();
                var result = await _ownerService.GetPendingEmployeeRequestsAsync(cafeId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("employee-requests/{id}/reject")]
        public async Task<IActionResult> RejectEmployeeRequest(int id)
        {
            try
            {
                var cafeId = GetCafeId();
                var result = await _ownerService.RejectEmployeeRequestAsync(cafeId, id);

                if (!result)
                    return NotFound(new { message = "Request not found" });

                return Ok(new { message = "Request rejected" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("employee-requests/{id}/approve")]
        public async Task<IActionResult> ApproveEmployeeRequest(int id, [FromBody] ApproveEmployeeRequestDto request)
        {
            try
            {
                var cafeId = GetCafeId();
                var result = await _ownerService.ApproveEmployeeRequestAsync(cafeId, id, request);

                if (result == null)
                    return NotFound(new { message = "Request not found" });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        

        #endregion

        #region Employees

        [HttpGet("employees")]
        public async Task<IActionResult> GetEmployees()
        {
            try
            {
                var cafeId = GetCafeId();
                var employees = await _ownerService.GetEmployeesAsync(cafeId);
                return Ok(employees);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("employees/{id}")]
        public async Task<IActionResult> GetEmployeeDetail(int id)
        {
            try
            {
                var cafeId = GetCafeId();
                var employee = await _ownerService.GetEmployeeDetailAsync(cafeId, id);

                if (employee == null)
                    return NotFound(new { message = "Employee not found" });

                return Ok(employee);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("employees/{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            try
            {
                var cafeId = GetCafeId();
                var result = await _ownerService.DeleteEmployeeAsync(cafeId, id);

                if (!result)
                    return NotFound(new { message = "Employee not found" });

                return Ok(new { message = "Employee deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion

        #region Sales Reports

        [HttpGet("sales-report")]
        public async Task<IActionResult> GetSalesReport([FromQuery] DateRangeRequestDto request)
        {
            try
            {
                var cafeId = GetCafeId();
                var report = await _ownerService.GetSalesReportAsync(cafeId, request);
                return Ok(report);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion

        #region Cost of Production

        [HttpGet("cost-report")]
        public async Task<IActionResult> GetCostOfProductionReport([FromQuery] DateRangeRequestDto request)
        {
            try
            {
                var cafeId = GetCafeId();
                var report = await _ownerService.GetCostOfProductionReportAsync(cafeId, request);
                return Ok(report);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion

        #region Items

        [HttpGet("items")]
        public async Task<IActionResult> GetItemsByPriceRange()
        {
            try
            {
                var cafeId = GetCafeId();
                var items = await _ownerService.GetItemsByPriceRangeAsync(cafeId);
                return Ok(items);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        #endregion
    }
}