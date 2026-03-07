namespace CafeManagementAPI.Dtos.Owner
{
    // Dashboard DTOs
    public class DashboardSummaryDto
    {
        public decimal TotalSales { get; set; }
        public decimal TotalCostOfProduction { get; set; }
        public decimal TotalBills { get; set; }
        public decimal TotalEmployeeSalary { get; set; }
        public decimal IrregularCosts { get; set; }
        public decimal TotalProfitOrLoss { get; set; }
        public decimal TotalIncome { get; set; }
        public List<WeeklyIncomeDto> WeeklyIncomeData { get; set; } = new();
    }

    public class WeeklyIncomeDto
    {
        public string WeekLabel { get; set; } = string.Empty;
        public decimal Income { get; set; }
    }

    public class DateRangeRequestDto
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Period { get; set; } // Week, Month, Year
    }

    // Employee DTOs
    public class EmployeeCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public int? Age { get; set; }
        public string? Sex { get; set; }
        public string? Address { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? ImageUrl { get; set; }
        public string Designation { get; set; } = string.Empty;
        public string? Shift { get; set; }
        public decimal Salary { get; set; }
    }

    public class EmployeeResponseDto
    {
        public int Id { get; set; }
        public string EmployeeId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string Designation { get; set; } = string.Empty;
        public string? Shift { get; set; }
        public decimal Salary { get; set; }
        public bool IsActive { get; set; }
        public DateTime JoiningDate { get; set; }
    }

    public class EmployeeDetailDto : EmployeeResponseDto
    {
        public int? Age { get; set; }
        public string? Sex { get; set; }
        public string? Address { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public List<AttendanceDto> AttendanceThisMonth { get; set; } = new();
        public int AbsentDaysCount { get; set; }
        public SalaryStatusDto? LastMonthSalary { get; set; }
        public int OrdersTakenThisMonth { get; set; }
    }

    public class AttendanceDto
    {
        public DateTime Date { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class SalaryStatusDto
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public decimal Amount { get; set; }
        public bool IsPaid { get; set; }
        public DateTime? PaidDate { get; set; }
    }

    // Sales Report DTOs
    public class SalesReportDto
    {
        public decimal TotalSales { get; set; }
        public int TotalOrders { get; set; }
        public List<SoldItemDto> SoldItems { get; set; } = new();
        public TopSellingItemDto? TopSellingItem { get; set; }
        public List<WeeklySalesDto> WeeklySalesData { get; set; } = new();
    }

    public class SoldItemDto
    {
        public int MenuItemId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public int QuantitySold { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalRevenue { get; set; }
    }

    public class TopSellingItemDto
    {
        public int MenuItemId { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public int QuantitySold { get; set; }
        public decimal TotalRevenue { get; set; }
        public decimal UnitPrice { get; set; }
    }

    public class WeeklySalesDto
    {
        public string WeekLabel { get; set; } = string.Empty;
        public decimal SalesAmount { get; set; }
    }

    // Cost of Production DTOs
    public class CostOfProductionReportDto
    {
        public decimal TotalCost { get; set; }
        public List<IngredientCostDto> IngredientCosts { get; set; } = new();
        public MostCostlyIngredientDto? MostCostlyIngredient { get; set; }
        public MostUsedIngredientDto? MostUsedIngredient { get; set; }
        public List<WeeklyCostDto> WeeklyCostData { get; set; } = new();
    }

    public class IngredientCostDto
    {
        public int IngredientId { get; set; }
        public string IngredientName { get; set; } = string.Empty;
        public string UnitOfMeasure { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public decimal QuantityUsed { get; set; }
        public decimal TotalCost { get; set; }
    }

    public class MostCostlyIngredientDto
    {
        public int IngredientId { get; set; }
        public string IngredientName { get; set; } = string.Empty;
        public decimal TotalCost { get; set; }
    }

    public class MostUsedIngredientDto
    {
        public int IngredientId { get; set; }
        public string IngredientName { get; set; } = string.Empty;
        public decimal QuantityUsed { get; set; }
        public string UnitOfMeasure { get; set; } = string.Empty;
    }

    public class WeeklyCostDto
    {
        public string WeekLabel { get; set; } = string.Empty;
        public decimal CostAmount { get; set; }
    }

    // Items DTOs
    public class ItemsByPriceRangeDto
    {
        public List<MenuItemDto> HighPriceItems { get; set; } = new();
        public List<MenuItemDto> MediumPriceItems { get; set; } = new();
        public List<MenuItemDto> LowPriceItems { get; set; } = new();
    }

    public class MenuItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal UnitPrice { get; set; }
        public string? ImageUrl { get; set; }
        public string? CategoryName { get; set; }
        public bool IsAvailable { get; set; }
    }
}
