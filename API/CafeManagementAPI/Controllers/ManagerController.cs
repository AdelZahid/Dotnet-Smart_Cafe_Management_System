using CafeManagementAPI.Dtos.Manager;
using CafeManagementAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CafeManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Owner,Manager")]
    public class ManagerController : ControllerBase
    {
        private readonly IManagerService _managerService;

        public ManagerController(IManagerService managerService)
        {
            _managerService = managerService;
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

        #region Items
        [HttpGet("items")]
        public async Task<IActionResult> GetItems()
        {
            try
            {
                var cafeId = GetCafeId();
                var items = await _managerService.GetItemsAsync(cafeId);
                return Ok(items);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("items")]
        public async Task<IActionResult> CreateItem([FromBody] ItemCreateDto request)
        {
            try
            {
                var cafeId = GetCafeId();
                var item = await _managerService.CreateItemAsync(cafeId, request);
                return CreatedAtAction(nameof(GetItems), new { id = item.Id }, item);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("items/{id}")]
        public async Task<IActionResult> UpdateItem(int id, [FromBody] ItemUpdateDto request)
        {
            try
            {
                var cafeId = GetCafeId();
                var item = await _managerService.UpdateItemAsync(cafeId, id, request);
                if (item == null)
                    return NotFound(new { message = "Item not found" });
                return Ok(item);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        #endregion

        #region Orders
        [HttpGet("orders/current")]
        public async Task<IActionResult> GetCurrentOrders()
        {
            try
            {
                var cafeId = GetCafeId();
                var orders = await _managerService.GetCurrentOrdersAsync(cafeId);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("orders/online")]
        public async Task<IActionResult> GetOnlineOrders()
        {
            try
            {
                var cafeId = GetCafeId();
                var orders = await _managerService.GetOnlineOrdersAsync(cafeId);
                return Ok(orders);
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
                var cafeId = GetCafeId();
                var result = await _managerService.UpdateOrderStatusAsync(cafeId, id, request.Status);
                if (!result)
                    return NotFound(new { message = "Order not found" });
                return Ok(new { message = "Order status updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        #endregion

        #region Purchased Orders
        [HttpGet("orders/purchased")]
        public async Task<IActionResult> GetPurchasedOrders([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            try
            {
                var cafeId = GetCafeId();
                var orders = await _managerService.GetPurchasedOrdersAsync(cafeId, startDate, endDate);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        #endregion

        #region Refund/Cancel
        [HttpGet("orders/refund-cancel")]
        public async Task<IActionResult> GetRefundCancelOrders([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            try
            {
                var cafeId = GetCafeId();
                var orders = await _managerService.GetRefundCancelOrdersAsync(cafeId, startDate, endDate);
                return Ok(orders);
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
                var cafeId = GetCafeId();
                var result = await _managerService.ProcessRefundAsync(cafeId, id, request.RefundAmount, request.Reason);
                if (!result)
                    return NotFound(new { message = "Order not found" });
                return Ok(new { message = "Refund processed successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        #endregion

        #region Ingredients
        [HttpGet("ingredients")]
        public async Task<IActionResult> GetIngredients()
        {
            try
            {
                var cafeId = GetCafeId();
                var ingredients = await _managerService.GetIngredientsAsync(cafeId);
                return Ok(ingredients);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("ingredients")]
        public async Task<IActionResult> CreateIngredient([FromBody] IngredientCreateDto request)
        {
            try
            {
                var cafeId = GetCafeId();
                var ingredient = await _managerService.CreateIngredientAsync(cafeId, request);
                return CreatedAtAction(nameof(GetIngredients), new { id = ingredient.Id }, ingredient);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("ingredients/daily-entry")]
        public async Task<IActionResult> AddDailyIngredientEntry([FromBody] DailyIngredientEntryDto request)
        {
            try
            {
                var cafeId = GetCafeId();
                var result = await _managerService.AddDailyIngredientEntryAsync(cafeId, request);
                if (!result)
                    return BadRequest(new { message = "Failed to add daily entry" });
                return Ok(new { message = "Daily entry added successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        #endregion

        #region Additional Costs
        [HttpGet("additional-costs")]
        public async Task<IActionResult> GetAdditionalCosts([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            try
            {
                var cafeId = GetCafeId();
                var costs = await _managerService.GetAdditionalCostsAsync(cafeId, startDate, endDate);
                return Ok(costs);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("additional-costs")]
        public async Task<IActionResult> CreateAdditionalCost([FromBody] AdditionalCostCreateDto request)
        {
            try
            {
                var cafeId = GetCafeId();
                var cost = await _managerService.CreateAdditionalCostAsync(cafeId, request);
                return CreatedAtAction(nameof(GetAdditionalCosts), new { id = cost.Id }, cost);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        #endregion

        #region Reservations
        [HttpGet("reservations")]
        public async Task<IActionResult> GetReservations([FromQuery] DateTime? date)
        {
            try
            {
                var cafeId = GetCafeId();
                var reservations = await _managerService.GetReservationsAsync(cafeId, date);
                return Ok(reservations);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("reservations/today")]
        public async Task<IActionResult> GetTodaysReservations()
        {
            try
            {
                var cafeId = GetCafeId();
                var reservations = await _managerService.GetTodaysReservationsAsync(cafeId);
                return Ok(reservations);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("reservations")]
        public async Task<IActionResult> CreateReservation([FromBody] ReservationCreateDto request)
        {
            try
            {
                var cafeId = GetCafeId();
                var reservation = await _managerService.CreateReservationAsync(cafeId, request);
                return CreatedAtAction(nameof(GetReservations), new { id = reservation.Id }, reservation);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("reservations/{id}/cancel")]
        public async Task<IActionResult> CancelReservation(int id)
        {
            try
            {
                var cafeId = GetCafeId();
                var result = await _managerService.CancelReservationAsync(cafeId, id);
                if (!result)
                    return NotFound(new { message = "Reservation not found" });
                return Ok(new { message = "Reservation cancelled successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        #endregion

        #region Salary
        [HttpGet("salary")]
        public async Task<IActionResult> GetSalaryPayments([FromQuery] int month, [FromQuery] int year)
        {
            try
            {
                var cafeId = GetCafeId();
                var payments = await _managerService.GetSalaryPaymentsAsync(cafeId, month, year);
                return Ok(payments);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("salary")]
        public async Task<IActionResult> ProcessSalaryPayment([FromBody] SalaryPaymentCreateDto request)
        {
            try
            {
                var cafeId = GetCafeId();
                var payment = await _managerService.ProcessSalaryPaymentAsync(cafeId, request);
                return CreatedAtAction(nameof(GetSalaryPayments), new { id = payment.Id }, payment);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        #endregion
    }

    public class UpdateOrderStatusRequestDto
    {
        public string Status { get; set; } = string.Empty;
    }

    public class ProcessRefundRequestDto
    {
        public decimal RefundAmount { get; set; }
        public string? Reason { get; set; }
    }
}
