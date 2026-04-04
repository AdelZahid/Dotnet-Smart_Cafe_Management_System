using CafeManagementAPI.Dtos.Waiter;
using CafeManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CafeManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Waiter")]
    public class WaiterController : ControllerBase
    {
        private readonly IWaiterService _waiterService;

        public WaiterController(IWaiterService waiterService)
        {
            _waiterService = waiterService;
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

        private int GetWaiterId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim))
            {
                throw new InvalidOperationException("UserId not found in token");
            }
            return int.Parse(userIdClaim);
        }

        #region Menu
        [HttpGet("menu")]
        public async Task<IActionResult> GetMenu()
        {
            try
            {
                var cafeId = GetCafeId();
                var menu = await _waiterService.GetAvailableMenuItemsAsync(cafeId);
                return Ok(menu);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("tables")]
        public async Task<IActionResult> GetTableOverview([FromQuery] DateTime? date)
        {
            try
            {
                var cafeId = GetCafeId();
                var tables = await _waiterService.GetTableOverviewAsync(cafeId, date);
                return Ok(tables);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        #endregion

        #region Orders
        [HttpGet("orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            try
            {
                var waiterId = GetWaiterId();
                var orders = await _waiterService.GetMyOrdersAsync(waiterId);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("orders")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto request)
        {
            try
            {
                var cafeId = GetCafeId();
                var waiterId = GetWaiterId();
                var order = await _waiterService.CreateOrderAsync(cafeId, waiterId, request);
                return CreatedAtAction(nameof(GetMyOrders), new { id = order.Id }, order);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("orders/{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusRequestDto request)
        {
            try
            {
                var waiterId = GetWaiterId();
                var result = await _waiterService.UpdateOrderStatusAsync(id, waiterId, request.Status);
                if (!result)
                    return NotFound(new { message = "Order not found or invalid status transition" });
                return Ok(new { message = "Order status updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        #endregion

        #region Payments
        [HttpGet("payments/served-orders")]
        public async Task<IActionResult> GetServedOrdersForPayment()
        {
            try
            {
                var waiterId = GetWaiterId();
                var orders = await _waiterService.GetServedOrdersForPaymentAsync(waiterId);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("payments")]
        public async Task<IActionResult> ProcessPayment([FromBody] PaymentCreateDto request)
        {
            try
            {
                var waiterId = GetWaiterId();
                var payment = await _waiterService.ProcessPaymentAsync(waiterId, request);
                return CreatedAtAction(nameof(GetServedOrdersForPayment), new { id = payment.Id }, payment);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("orders/{id}/refund")]
        public async Task<IActionResult> ProcessRefund(int id, [FromBody] ProcessRefundRequestDto request)
        {
            try
            {
                var waiterId = GetWaiterId();
                var result = await _waiterService.ProcessRefundAsync(id, waiterId, request.Reason);
                if (!result)
                    return NotFound(new { message = "Order not found or not eligible for refund" });
                return Ok(new { message = "Refund processed successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        #endregion
    }

    public class WaiterUpdateOrderStatusRequestDto
    {
        public string Status { get; set; } = string.Empty;
    }

    public class WaiterProcessRefundRequestDto
    {
        public string? Reason { get; set; }
    }
}
