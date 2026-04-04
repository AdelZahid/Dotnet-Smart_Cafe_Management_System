namespace CafeManagementAPI.Dtos.Waiter
{
    // Menu DTOs
    public class MenuItemForWaiterDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal UnitPrice { get; set; }
        public string? ImageUrl { get; set; }
        public string? CategoryName { get; set; }
    }

    // Order Taking DTOs
    public class CreateOrderDto
    {
        public int? TableId { get; set; }
        public string OrderType { get; set; } = "DineIn";
        public string? CustomerName { get; set; }
        public string? CustomerPhone { get; set; }
        public string? CustomerAddress { get; set; }
        public List<OrderItemCreateDto> Items { get; set; } = new();
        public string? Notes { get; set; }
    }

    public class OrderItemCreateDto
    {
        public int MenuItemId { get; set; }
        public int Quantity { get; set; } = 1;
        public string? Notes { get; set; }
    }

    // Order List DTOs
    public class WaiterOrderListDto
    {
        public int Id { get; set; }
        public string? TableNumber { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public List<OrderItemSummaryDto> Items { get; set; } = new();
    }

    public class OrderItemSummaryDto
    {
        public string ItemName { get; set; } = string.Empty;
        public int Quantity { get; set; }
    }

    // Order Status Update DTOs
    public class OrderStatusUpdateDto
    {
        public int OrderId { get; set; }
        public string Status { get; set; } = string.Empty; // Ready, Served, Cancelled
    }

    // Payment DTOs
    public class PaymentCreateDto
    {
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = string.Empty; // Cash, Card, Mobile Banking
        public string? TransactionId { get; set; }
        public string? Notes { get; set; }
    }

    public class PaymentResponseDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public DateTime PaymentDate { get; set; }
        public string? TransactionId { get; set; }
    }

    // Served Orders for Payment
    public class ServedOrderForPaymentDto
    {
        public int Id { get; set; }
        public string? TableNumber { get; set; }
        public string? CustomerName { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime ServedDate { get; set; }
        public List<OrderItemSummaryDto> Items { get; set; } = new();
    }

    public class WaiterTableReservationInfoDto
    {
        public int ReservationId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public DateTime ReservationDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int NumberOfGuests { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class WaiterTableOverviewDto
    {
        public int TableId { get; set; }
        public string TableNumber { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public bool IsActive { get; set; }
        public string Status { get; set; } = string.Empty;
        public List<WaiterTableReservationInfoDto> Reservations { get; set; } = new();
    }

    // Notification DTO
    public class OrderReadyNotificationDto
    {
        public int OrderId { get; set; }
        public string? TableNumber { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime ReadyTime { get; set; }
    }
}
