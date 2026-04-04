namespace CafeManagementAPI.Dtos.Manager
{
    // Item DTOs
    public class ItemCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal UnitPrice { get; set; }
        public string? ImageUrl { get; set; }
        public int? CategoryId { get; set; }
    }

    public class ItemUpdateDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal? UnitPrice { get; set; }
        public string? ImageUrl { get; set; }
        public int? CategoryId { get; set; }
        public bool? IsAvailable { get; set; }
    }

    public class ItemResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal UnitPrice { get; set; }
        public string? ImageUrl { get; set; }
        public string PriceRange { get; set; } = string.Empty;
        public string? CategoryName { get; set; }
        public bool IsAvailable { get; set; }
    }

    // Order DTOs
    public class OrderResponseDto
    {
        public int Id { get; set; }
        public string OrderType { get; set; } = string.Empty;
        public string? TableNumber { get; set; }
        public string? WaiterName { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerPhone { get; set; }
        public string? CustomerAddress { get; set; }
        public DateTime OrderDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public bool IsPaid { get; set; }
        public List<OrderItemResponseDto> OrderItems { get; set; } = new();
    }

    public class OrderItemResponseDto
    {
        public int Id { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }

    // Purchased/Delivered Orders DTO
    public class PurchasedOrderDto
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime? PaymentDate { get; set; }
        public string? CustomerName { get; set; }
        public string? CustomerPhone { get; set; }
        public string? CustomerAddress { get; set; }
        public decimal TotalAmount { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public bool IsDelivered { get; set; }
        public DateTime? DeliveredDate { get; set; }
    }

    // Refund/Cancel DTOs
    public class RefundCancelOrderDto
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime? CancelledDate { get; set; }
        public string? CustomerName { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty; // Cancelled, Refunded
        public string? Reason { get; set; }
        public DateTime? RefundDate { get; set; }
        public decimal? RefundAmount { get; set; }
    }

    // Ingredient DTOs
    public class IngredientCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public string UnitOfMeasure { get; set; } = string.Empty;
        public decimal MinStockLevel { get; set; } = 0;
    }

    public class IngredientPurchaseDto
    {
        public int IngredientId { get; set; }
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public string? SupplierName { get; set; }
        public string? Notes { get; set; }
    }

    public class IngredientUsageDto
    {
        public int IngredientId { get; set; }
        public decimal QuantityUsed { get; set; }
        public decimal QuantityWasted { get; set; } = 0;
        public string? Notes { get; set; }
    }

    public class IngredientResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string UnitOfMeasure { get; set; } = string.Empty;
        public decimal CurrentStock { get; set; }
        public decimal MinStockLevel { get; set; }
    }

    public class DailyIngredientEntryDto
    {
        public List<IngredientPurchaseDto> Purchases { get; set; } = new List<IngredientPurchaseDto>();
        public List<IngredientUsageDto> Usages { get; set; } = new List<IngredientUsageDto>();
    }

    // Additional Cost DTOs
    public class AdditionalCostCreateDto
    {
        public string CostType { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime CostDate { get; set; }
        public string? Description { get; set; }
        public bool IsRecurring { get; set; } = false;
    }

    public class AdditionalCostResponseDto
    {
        public int Id { get; set; }
        public string CostType { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime CostDate { get; set; }
        public string? Description { get; set; }
        public bool IsRecurring { get; set; }
    }

    // Reservation DTOs
    public class ReservationCreateDto
    {
        public int TableId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public string? CustomerEmail { get; set; }
        public DateTime ReservationDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int NumberOfGuests { get; set; } = 2;
        public string? Notes { get; set; }
    }

    public class ReservationResponseDto
    {
        public int Id { get; set; }
        public string TableNumber { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public DateTime ReservationDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int NumberOfGuests { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class TodaysReservationDto
    {
        public int Id { get; set; }
        public string TableNumber { get; set; } = string.Empty;
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public int NumberOfGuests { get; set; }
    }

    public class TableReservationInfoDto
    {
        public int ReservationId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerPhone { get; set; } = string.Empty;
        public DateTime ReservationDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int NumberOfGuests { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class TableOverviewDto
    {
        public int TableId { get; set; }
        public string TableNumber { get; set; } = string.Empty;
        public int Capacity { get; set; }
        public bool IsActive { get; set; }
        public string Status { get; set; } = string.Empty;
        public List<TableReservationInfoDto> Reservations { get; set; } = new();
    }

    // Salary DTOs
    public class SalaryPaymentCreateDto
    {
        public int EmployeeId { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }

    public class SalaryPaymentResponseDto
    {
        public int Id { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public int Month { get; set; }
        public int Year { get; set; }
        public decimal Amount { get; set; }
        public bool IsPaid { get; set; }
        public DateTime? PaidDate { get; set; }
        public string? PaymentMethod { get; set; }
    }
}
