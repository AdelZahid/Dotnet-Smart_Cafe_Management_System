using CafeManagementAPI.Data;
using CafeManagementAPI.Dtos.Owner;
using CafeManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CafeManagementAPI.Services
{
    public interface IOwnerService
    {
        Task<DashboardSummaryDto> GetDashboardSummaryAsync(int cafeId, DateRangeRequestDto request);
        Task<List<EmployeeResponseDto>> GetEmployeesAsync(int cafeId);
        Task<EmployeeDetailDto?> GetEmployeeDetailAsync(int cafeId, int employeeId);
        Task<List<EmployeeRequestResponseDto>> GetPendingEmployeeRequestsAsync(int cafeId);
        Task<EmployeeResponseDto?> ApproveEmployeeRequestAsync(int cafeId, int requestId, ApproveEmployeeRequestDto request);
        Task<bool> RejectEmployeeRequestAsync(int cafeId,int requestId);
        Task<bool> DeleteEmployeeAsync(int cafeId, int employeeId);
        Task<SalesReportDto> GetSalesReportAsync(int cafeId, DateRangeRequestDto request);
        Task<CostOfProductionReportDto> GetCostOfProductionReportAsync(int cafeId, DateRangeRequestDto request);
        Task<ItemsByPriceRangeDto> GetItemsByPriceRangeAsync(int cafeId);
    }

    public class OwnerService : IOwnerService
    {
        private readonly ApplicationDbContext _context;

        public OwnerService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardSummaryDto> GetDashboardSummaryAsync(int cafeId, DateRangeRequestDto request)
        {
            var startDate = request.StartDate ?? DateTime.UtcNow.AddDays(-30);
            var endDate = request.EndDate ?? DateTime.UtcNow;


            var totalSales = await _context.Orders
                .Include(o => o.Payments)
                .Where(o => o.CafeId == cafeId && o.IsPaid)
                .Where(o => o.Payments.Any(p => p.PaymentDate >= startDate && p.PaymentDate <= endDate))
                .SumAsync(o => o.TotalAmount);

            var totalCostOfProduction = await _context.IngredientUsages
                .Where(iu => iu.Ingredient.CafeId == cafeId && iu.UsageDate >= startDate && iu.UsageDate <= endDate)
                .Join(_context.IngredientPurchases,
                    iu => iu.IngredientId,
                    ip => ip.IngredientId,
                    (iu, ip) => new { iu, ip })
                .SumAsync(x => x.iu.QuantityUsed * x.ip.UnitPrice);

            var totalBills = await _context.AdditionalCosts
                .Where(ac => ac.CafeId == cafeId && ac.CostDate >= startDate && ac.CostDate <= endDate)
                .SumAsync(ac => ac.Amount);

            var totalEmployeeSalary = await _context.SalaryPayments
                .Where(sp => sp.Employee.CafeId == cafeId && sp.IsPaid)
                .Where(sp => sp.PaidDate >= startDate && sp.PaidDate <= endDate)
                .SumAsync(sp => sp.Amount);

            var irregularCosts = await _context.AdditionalCosts
                .Where(ac => ac.CafeId == cafeId && !ac.IsRecurring && ac.CostDate >= startDate && ac.CostDate <= endDate)
                .SumAsync(ac => ac.Amount);

            var totalIncome = totalSales;
            var totalProfitOrLoss = totalIncome - totalCostOfProduction - totalBills - totalEmployeeSalary - irregularCosts;
            var weeklyIncomeData = await GetWeeklyIncomeDataAsync(cafeId, startDate, endDate);

            return new DashboardSummaryDto
            {
                TotalSales = totalSales,
                TotalCostOfProduction = totalCostOfProduction,
                TotalBills = totalBills,
                TotalEmployeeSalary = totalEmployeeSalary,
                IrregularCosts = irregularCosts,
                TotalProfitOrLoss = totalProfitOrLoss,
                TotalIncome = totalIncome,
                WeeklyIncomeData = weeklyIncomeData
            };
        }

        private async Task<List<WeeklyIncomeDto>> GetWeeklyIncomeDataAsync(int cafeId, DateTime startDate, DateTime endDate)
        {
            var weeklyData = new List<WeeklyIncomeDto>();
            var currentWeekStart = startDate;
            int weekNumber = 1;

            while (currentWeekStart < endDate)
            {
                var currentWeekEnd = currentWeekStart.AddDays(7);
                if (currentWeekEnd > endDate) currentWeekEnd = endDate;

                var weekIncome = await _context.Orders
                    .Include(o => o.Payments)
                    .Where(o => o.CafeId == cafeId && o.IsPaid)
                    .Where(o => o.Payments.Any(p => p.PaymentDate >= currentWeekStart && p.PaymentDate < currentWeekEnd))
                    .SumAsync(o => o.TotalAmount);

                weeklyData.Add(new WeeklyIncomeDto
                {
                    WeekLabel = $"Week {weekNumber}",
                    Income = weekIncome
                });

                currentWeekStart = currentWeekEnd;
                weekNumber++;
            }

            return weeklyData;
        }

        public async Task<List<EmployeeRequestResponseDto>> GetPendingEmployeeRequestsAsync(int cafeId)
        {
            var cafe = await _context.CafeProfiles.FirstOrDefaultAsync(c => c.Id == cafeId);
            if (cafe == null)
                return new List<EmployeeRequestResponseDto>();

            var requests = await _context.EmployeeRegistrationRequests
                .Where(r => r.Status == "Pending" && r.CafeEmail == cafe.Email)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();

            return requests.Select(r => new EmployeeRequestResponseDto
            {
                Id = r.Id,
                Name = r.Name,
                Age = r.Age,
                Sex = r.Sex,
                Email = r.Email,
                CafeEmail = r.CafeEmail,
                Phone = r.Phone,
                Address = r.Address,
                Designation = r.Designation,
                ImageUrl = r.ImageUrl,
                Status = r.Status,
                CreatedAt = r.CreatedAt
            }).ToList();
        }

        public async Task<EmployeeResponseDto?> ApproveEmployeeRequestAsync(int cafeId, int requestId, ApproveEmployeeRequestDto request)
        {
            var cafe = await _context.CafeProfiles.FirstOrDefaultAsync(c => c.Id == cafeId);
            if (cafe == null) return null;

            var pendingRequest = await _context.EmployeeRegistrationRequests
                .FirstOrDefaultAsync(r =>
                    r.Id == requestId &&
                    r.Status == "Pending" &&
                    r.CafeEmail == cafe.Email);

            if (pendingRequest == null) return null;

            var employeeId = await GenerateEmployeeIdAsync();

            var employee = new Employee
            {
                CafeId = cafeId,
                EmployeeId = employeeId,
                Name = pendingRequest.Name,
                Age = pendingRequest.Age,
                Sex = pendingRequest.Sex,
                Address = pendingRequest.Address,
                Email = pendingRequest.Email,
                Phone = pendingRequest.Phone,
                ImageUrl = pendingRequest.ImageUrl,
                Designation = pendingRequest.Designation,
                Shift = request.Shift,
                Salary = request.Salary,
                JoiningDate = DateTime.UtcNow,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Employees.Add(employee);

            pendingRequest.Status = "Approved";
            pendingRequest.ApprovedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return MapToEmployeeResponseDto(employee);
        }

        public async Task<bool> RejectEmployeeRequestAsync(int cafeId, int requestId)
        {
            var cafe = await _context.CafeProfiles.FirstOrDefaultAsync(c => c.Id == cafeId);
            if (cafe == null) return false;

            var pendingRequest = await _context.EmployeeRegistrationRequests
                .FirstOrDefaultAsync(r =>
                    r.Id == requestId &&
                    r.Status == "Pending" &&
                    r.CafeEmail == cafe.Email);

            if (pendingRequest == null) return false;

            pendingRequest.Status = "Rejected";
            pendingRequest.RejectedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteEmployeeAsync(int cafeId, int employeeId)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.CafeId == cafeId && e.Id == employeeId);

            if (employee == null) return false;

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            return true;
        }

        private async Task<string> GenerateEmployeeIdAsync()
        {
            var prefix = "EMP";
            var random = new Random();
            string employeeId;

            do
            {
                var number = random.Next(10000, 99999);
                employeeId = $"{prefix}{number}";
            } while (await _context.Employees.AnyAsync(e => e.EmployeeId == employeeId));

            return employeeId;
        }

        public async Task<List<EmployeeResponseDto>> GetEmployeesAsync(int cafeId)
        {
            var employees = await _context.Employees
                .Where(e => e.CafeId == cafeId)
                .OrderBy(e => e.Name)
                .ToListAsync();

            return employees.Select(MapToEmployeeResponseDto).ToList();
        }

        public async Task<EmployeeDetailDto?> GetEmployeeDetailAsync(int cafeId, int employeeId)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.CafeId == cafeId && e.Id == employeeId);

            if (employee == null) return null;

            var currentMonth = DateTime.UtcNow.Month;
            var currentYear = DateTime.UtcNow.Year;

            var attendance = await _context.Attendances
                .Where(a => a.EmployeeId == employeeId && a.Date.Month == currentMonth && a.Date.Year == currentYear)
                .ToListAsync();

            var absentDays = attendance.Where(a => a.Status == "Absent").ToList();

            var lastMonth = currentMonth == 1 ? 12 : currentMonth - 1;
            var lastMonthYear = currentMonth == 1 ? currentYear - 1 : currentYear;

            var lastMonthSalary = await _context.SalaryPayments
                .FirstOrDefaultAsync(sp => sp.EmployeeId == employeeId && sp.Month == lastMonth && sp.Year == lastMonthYear);

            var ordersTaken = 0;
            if (employee.Designation == "Waiter")
            {
                ordersTaken = await _context.Orders
                    .CountAsync(o => o.WaiterId == employeeId && o.OrderDate.Month == currentMonth && o.OrderDate.Year == currentYear);
            }

            return new EmployeeDetailDto
            {
                Id = employee.Id,
                EmployeeId = employee.EmployeeId,
                Name = employee.Name,
                Age = employee.Age,
                Sex = employee.Sex,
                Address = employee.Address,
                Email = employee.Email,
                Phone = employee.Phone,
                ImageUrl = employee.ImageUrl,
                Designation = employee.Designation,
                Shift = employee.Shift,
                Salary = employee.Salary,
                IsActive = employee.IsActive,
                JoiningDate = employee.JoiningDate,
                AttendanceThisMonth = attendance.Select(a => new AttendanceDto
                {
                    Date = a.Date,
                    Status = a.Status
                }).ToList(),
                AbsentDaysCount = absentDays.Count,
                LastMonthSalary = lastMonthSalary != null ? new SalaryStatusDto
                {
                    Month = lastMonthSalary.Month,
                    Year = lastMonthSalary.Year,
                    Amount = lastMonthSalary.Amount,
                    IsPaid = lastMonthSalary.IsPaid,
                    PaidDate = lastMonthSalary.PaidDate
                } : null,
                OrdersTakenThisMonth = ordersTaken
            };
        }

        public async Task<SalesReportDto> GetSalesReportAsync(int cafeId, DateRangeRequestDto request)
        {
            var startDate = request.StartDate ?? DateTime.UtcNow.AddDays(-7);
            var endDate = request.EndDate ?? DateTime.UtcNow;

            var orders = await _context.Orders
                .Include(o => o.Payments)
                .Where(o => o.CafeId == cafeId && o.IsPaid)
                .Where(o => o.Payments.Any(p => p.PaymentDate >= startDate && p.PaymentDate <= endDate))
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.MenuItem)
                .ToListAsync();

            var totalSales = orders.Sum(o => o.TotalAmount);
            var totalOrders = orders.Count;

            var soldItems = orders
                .SelectMany(o => o.OrderItems)
                .GroupBy(oi => oi.MenuItemId)
                .Select(g => new SoldItemDto
                {
                    MenuItemId = g.Key,
                    ItemName = g.First().MenuItem.Name,
                    QuantitySold = g.Sum(oi => oi.Quantity),
                    UnitPrice = g.First().UnitPrice,
                    TotalRevenue = g.Sum(oi => oi.Quantity * oi.UnitPrice)
                })
                .OrderByDescending(si => si.QuantitySold)
                .ToList();

            var topSellingItem = soldItems.FirstOrDefault();
            var weeklySalesData = await GetWeeklySalesDataAsync(cafeId, startDate, endDate);

            return new SalesReportDto
            {
                TotalSales = totalSales,
                TotalOrders = totalOrders,
                SoldItems = soldItems,
                TopSellingItem = topSellingItem != null ? new TopSellingItemDto
                {
                    MenuItemId = topSellingItem.MenuItemId,
                    ItemName = topSellingItem.ItemName,
                    QuantitySold = topSellingItem.QuantitySold,
                    TotalRevenue = topSellingItem.TotalRevenue,
                    UnitPrice = topSellingItem.UnitPrice
                } : null,
                WeeklySalesData = weeklySalesData
            };
        }

        private async Task<List<WeeklySalesDto>> GetWeeklySalesDataAsync(int cafeId, DateTime startDate, DateTime endDate)
        {
            var weeklyData = new List<WeeklySalesDto>();
            var currentWeekStart = startDate;
            int weekNumber = 1;

            while (currentWeekStart < endDate)
            {
                var currentWeekEnd = currentWeekStart.AddDays(7);
                if (currentWeekEnd > endDate) currentWeekEnd = endDate;

                var weekSales = await _context.Orders
                    .Include(o => o.Payments)
                    .Where(o => o.CafeId == cafeId && o.IsPaid)
                    .Where(o => o.Payments.Any(p => p.PaymentDate >= currentWeekStart && p.PaymentDate < currentWeekEnd))
                    .SumAsync(o => o.TotalAmount);

                weeklyData.Add(new WeeklySalesDto
                {
                    WeekLabel = $"Week {weekNumber}",
                    SalesAmount = weekSales
                });

                currentWeekStart = currentWeekEnd;
                weekNumber++;
            }

            return weeklyData;
        }

        public async Task<CostOfProductionReportDto> GetCostOfProductionReportAsync(int cafeId, DateRangeRequestDto request)
        {
            var startDate = request.StartDate ?? DateTime.UtcNow.AddDays(-7);
            var endDate = request.EndDate ?? DateTime.UtcNow;

            var ingredientUsages = await _context.IngredientUsages
                .Where(iu => iu.Ingredient.CafeId == cafeId && iu.UsageDate >= startDate && iu.UsageDate <= endDate)
                .Include(iu => iu.Ingredient)
                .ToListAsync();

            var ingredientCosts = new List<IngredientCostDto>();

            var mostUsedIngredient = ingredientUsages
                .GroupBy(iu => iu.IngredientId)
                .Select(g => new
                {
                    IngredientId = g.Key,
                    IngredientName = g.First().Ingredient.Name,
                    UnitOfMeasure = g.First().Ingredient.UnitOfMeasure,
                    TotalQuantity = g.Sum(iu => iu.QuantityUsed)
                })
                .OrderByDescending(x => x.TotalQuantity)
                .FirstOrDefault();

            var mostCostlyIngredient = ingredientUsages
                .GroupBy(iu => iu.IngredientId)
                .Select(g => new
                {
                    IngredientId = g.Key,
                    IngredientName = g.First().Ingredient.Name,
                    TotalCost = g.Sum(iu => iu.QuantityUsed * GetLatestUnitPrice(iu.IngredientId))
                })
                .OrderByDescending(x => x.TotalCost)
                .FirstOrDefault();

            foreach (var usage in ingredientUsages)
            {
                var unitPrice = await GetLatestUnitPriceAsync(usage.IngredientId);
                ingredientCosts.Add(new IngredientCostDto
                {
                    IngredientId = usage.IngredientId,
                    IngredientName = usage.Ingredient.Name,
                    UnitOfMeasure = usage.Ingredient.UnitOfMeasure,
                    UnitPrice = unitPrice,
                    QuantityUsed = usage.QuantityUsed,
                    TotalCost = usage.QuantityUsed * unitPrice
                });
            }

            var totalCost = ingredientCosts.Sum(ic => ic.TotalCost);
            var weeklyCostData = await GetWeeklyCostDataAsync(cafeId, startDate, endDate);

            return new CostOfProductionReportDto
            {
                TotalCost = totalCost,
                IngredientCosts = ingredientCosts,
                MostCostlyIngredient = mostCostlyIngredient != null ? new MostCostlyIngredientDto
                {
                    IngredientId = mostCostlyIngredient.IngredientId,
                    IngredientName = mostCostlyIngredient.IngredientName,
                    TotalCost = mostCostlyIngredient.TotalCost
                } : null,
                MostUsedIngredient = mostUsedIngredient != null ? new MostUsedIngredientDto
                {
                    IngredientId = mostUsedIngredient.IngredientId,
                    IngredientName = mostUsedIngredient.IngredientName,
                    QuantityUsed = mostUsedIngredient.TotalQuantity,
                    UnitOfMeasure = mostUsedIngredient.UnitOfMeasure
                } : null,
                WeeklyCostData = weeklyCostData
            };
        }

        private async Task<decimal> GetLatestUnitPriceAsync(int ingredientId)
        {
            var latestPurchase = await _context.IngredientPurchases
                .Where(ip => ip.IngredientId == ingredientId)
                .OrderByDescending(ip => ip.PurchaseDate)
                .FirstOrDefaultAsync();

            return latestPurchase?.UnitPrice ?? 0;
        }

        private decimal GetLatestUnitPrice(int ingredientId)
        {
            var latestPurchase = _context.IngredientPurchases
                .Where(ip => ip.IngredientId == ingredientId)
                .OrderByDescending(ip => ip.PurchaseDate)
                .FirstOrDefault();

            return latestPurchase?.UnitPrice ?? 0;
        }

        private async Task<List<WeeklyCostDto>> GetWeeklyCostDataAsync(int cafeId, DateTime startDate, DateTime endDate)
        {
            var weeklyData = new List<WeeklyCostDto>();
            var currentWeekStart = startDate;
            int weekNumber = 1;

            while (currentWeekStart < endDate)
            {
                var currentWeekEnd = currentWeekStart.AddDays(7);
                if (currentWeekEnd > endDate) currentWeekEnd = endDate;

                var weekCostUsages = await _context.IngredientUsages
                    .Where(iu => iu.Ingredient.CafeId == cafeId &&
                                 iu.UsageDate >= currentWeekStart &&
                                 iu.UsageDate < currentWeekEnd)
                    .ToListAsync();

                decimal totalWeekCost = 0;
                foreach (var usage in weekCostUsages)
                {
                    var unitPrice = GetLatestUnitPrice(usage.IngredientId);
                    totalWeekCost += usage.QuantityUsed * unitPrice;
                }

                weeklyData.Add(new WeeklyCostDto
                {
                    WeekLabel = $"Week {weekNumber}",
                    CostAmount = totalWeekCost
                });

                currentWeekStart = currentWeekEnd;
                weekNumber++;
            }

            return weeklyData;
        }

        public async Task<ItemsByPriceRangeDto> GetItemsByPriceRangeAsync(int cafeId)
        {
            var items = await _context.MenuItems
                .Where(mi => mi.CafeId == cafeId)
                .Include(mi => mi.Category)
                .ToListAsync();

            return new ItemsByPriceRangeDto
            {
                HighPriceItems = items.Where(i => i.PriceRange == "High")
                    .Select(MapToMenuItemDto)
                    .ToList(),
                MediumPriceItems = items.Where(i => i.PriceRange == "Medium")
                    .Select(MapToMenuItemDto)
                    .ToList(),
                LowPriceItems = items.Where(i => i.PriceRange == "Low")
                    .Select(MapToMenuItemDto)
                    .ToList()
            };
        }

        private EmployeeResponseDto MapToEmployeeResponseDto(Employee employee)
        {
            return new EmployeeResponseDto
            {
                Id = employee.Id,
                EmployeeId = employee.EmployeeId,
                Name = employee.Name,
                ImageUrl = employee.ImageUrl,
                Designation = employee.Designation,
                Shift = employee.Shift,
                Salary = employee.Salary,
                IsActive = employee.IsActive,
                JoiningDate = employee.JoiningDate
            };
        }

        private MenuItemDto MapToMenuItemDto(MenuItem item)
        {
            return new MenuItemDto
            {
                Id = item.Id,
                Name = item.Name,
                Description = item.Description,
                UnitPrice = item.UnitPrice,
                ImageUrl = item.ImageUrl,
                CategoryName = item.Category?.Name,
                IsAvailable = item.IsAvailable
            };
        }
    }
}