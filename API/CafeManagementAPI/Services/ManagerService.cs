using CafeManagementAPI.Data;
using CafeManagementAPI.Dtos.Manager;
using CafeManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CafeManagementAPI.Services
{
    public interface IManagerService
    {
        // Items
        Task<ItemResponseDto> CreateItemAsync(int cafeId, ItemCreateDto request);
        Task<List<ItemResponseDto>> GetItemsAsync(int cafeId);
        Task<ItemResponseDto?> UpdateItemAsync(int cafeId, int itemId, ItemUpdateDto request);
        Task<bool> DeleteItemAsync(int cafeId, int itemId);

        // Orders
        Task<List<OrderResponseDto>> GetCurrentOrdersAsync(int cafeId);
        Task<List<OrderResponseDto>> GetOnlineOrdersAsync(int cafeId);
        Task<bool> UpdateOrderStatusAsync(int cafeId, int orderId, string status);

        // Purchased Orders
        Task<List<PurchasedOrderDto>> GetPurchasedOrdersAsync(int cafeId, DateTime? startDate, DateTime? endDate);

        // Refund/Cancel
        Task<List<RefundCancelOrderDto>> GetRefundCancelOrdersAsync(int cafeId, DateTime? startDate, DateTime? endDate);
        Task<bool> ProcessRefundAsync(int cafeId, int orderId, decimal refundAmount, string? reason);

        // Ingredients
        Task<IngredientResponseDto> CreateIngredientAsync(int cafeId, IngredientCreateDto request);
        Task<List<IngredientResponseDto>> GetIngredientsAsync(int cafeId);
        Task<bool> AddDailyIngredientEntryAsync(int cafeId, DailyIngredientEntryDto request);

        // Additional Costs
        Task<AdditionalCostResponseDto> CreateAdditionalCostAsync(int cafeId, AdditionalCostCreateDto request);
        Task<List<AdditionalCostResponseDto>> GetAdditionalCostsAsync(int cafeId, DateTime? startDate, DateTime? endDate);

        // Reservations
        Task<ReservationResponseDto> CreateReservationAsync(int cafeId, ReservationCreateDto request);
        Task<List<ReservationResponseDto>> GetReservationsAsync(int cafeId, DateTime? date);
        Task<List<TodaysReservationDto>> GetTodaysReservationsAsync(int cafeId);
        Task<List<TableOverviewDto>> GetTableOverviewAsync(int cafeId, DateTime? date);
        Task<bool> CancelReservationAsync(int cafeId, int reservationId);

        // Salary
        Task<SalaryPaymentResponseDto> ProcessSalaryPaymentAsync(int cafeId, SalaryPaymentCreateDto request);
        Task<List<SalaryPaymentResponseDto>> GetSalaryPaymentsAsync(int cafeId, int month, int year);
        Task<List<EmployeeBasicDto>> GetWaitersAsync(int cafeId);
    }

    public class ManagerService : IManagerService
    {
        private readonly ApplicationDbContext _context;

        public ManagerService(ApplicationDbContext context)
        {
            _context = context;
        }

        
        public async Task<ItemResponseDto> CreateItemAsync(int cafeId, ItemCreateDto request)
        {
            var item = new MenuItem
            {
                CafeId = cafeId,
                CategoryId = request.CategoryId,
                Name = request.Name,
                Description = request.Description,
                UnitPrice = request.UnitPrice,
                ImageUrl = request.ImageUrl,
                IsAvailable = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.MenuItems.Add(item);
            await _context.SaveChangesAsync();

            return await MapToItemResponseDtoAsync(item);
        }

        public async Task<List<ItemResponseDto>> GetItemsAsync(int cafeId)
        {
            var items = await _context.MenuItems
                .Where(mi => mi.CafeId == cafeId)
                .Include(mi => mi.Category)
                .ToListAsync();

            var result = new List<ItemResponseDto>();
            foreach (var item in items)
            {
                result.Add(await MapToItemResponseDtoAsync(item));
            }
            return result;
        }
        #region UpdateItem
        public async Task<ItemResponseDto?> UpdateItemAsync(int cafeId, int itemId, ItemUpdateDto request)
        {
            var item = await _context.MenuItems
                .FirstOrDefaultAsync(mi => mi.CafeId == cafeId && mi.Id == itemId);

            if (item == null) return null;

            if (request.Name != null) item.Name = request.Name;
            if (request.Description != null) item.Description = request.Description;
            if (request.UnitPrice.HasValue) item.UnitPrice = request.UnitPrice.Value;
            if (request.ImageUrl != null) item.ImageUrl = request.ImageUrl;
            if (request.CategoryId.HasValue) item.CategoryId = request.CategoryId.Value;
            if (request.IsAvailable.HasValue) item.IsAvailable = request.IsAvailable.Value;

            item.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return await MapToItemResponseDtoAsync(item);
        }
        #endregion

        #region Orders
        public async Task<List<OrderResponseDto>> GetCurrentOrdersAsync(int cafeId)
        {
            var orders = await _context.Orders
                .Where(o => o.CafeId == cafeId && (o.Status == "Pending" || o.Status == "Processing" || o.Status == "Ready"))
                .Include(o => o.Table)
                .Include(o => o.Waiter)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.MenuItem)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return orders.Select(MapToOrderResponseDto).ToList();
        }
        #endregion

        public async Task<List<OrderResponseDto>> GetOnlineOrdersAsync(int cafeId)
        {
            var orders = await _context.Orders
                .Where(o => o.CafeId == cafeId && o.OrderType == "Online" && (o.Status == "Pending" || o.Status == "Processing"))
                .Include(o => o.Waiter)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.MenuItem)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            return orders.Select(MapToOrderResponseDto).ToList();
        }

        public async Task<bool> UpdateOrderStatusAsync(int cafeId, int orderId, string status)
        {
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.CafeId == cafeId && o.Id == orderId);

            if (order == null) return false;

            order.Status = status;
            order.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return true;
        }
        

        #region Purchased Orders
        public async Task<List<PurchasedOrderDto>> GetPurchasedOrdersAsync(int cafeId, DateTime? startDate, DateTime? endDate)
        {
            var query = _context.Orders
                .Where(o => o.CafeId == cafeId && o.IsPaid && (o.Status == "Served" || o.Status == "Paid"))
                .Include(o => o.Payments)
                .AsQueryable();

            if (startDate.HasValue)
                query = query.Where(o => o.Payments.Any(p => p.PaymentDate >= startDate.Value));

            if (endDate.HasValue)
                query = query.Where(o => o.Payments.Any(p => p.PaymentDate <= endDate.Value));

            var orders = await query
                .OrderByDescending(o => o.Payments.Max(p => p.PaymentDate))
                .ToListAsync();

            return orders.Select(o => new PurchasedOrderDto
            {
                Id = o.Id,
                OrderDate = o.OrderDate,
                PaymentDate = o.Payments.FirstOrDefault()?.PaymentDate,
                CustomerName = o.CustomerName,
                CustomerPhone = o.CustomerPhone,
                CustomerAddress = o.CustomerAddress,
                TotalAmount = o.TotalAmount,
                PaymentMethod = o.Payments.FirstOrDefault()?.PaymentMethod ?? "Unknown",
                IsDelivered = o.Status == "Served" && o.OrderType == "Online",
                DeliveredDate = o.Status == "Served" ? o.UpdatedAt : null
            }).ToList();
        }
        #endregion

        #region Refund/Cancel
        public async Task<List<RefundCancelOrderDto>> GetRefundCancelOrdersAsync(int cafeId, DateTime? startDate, DateTime? endDate)
        {
            var query = _context.Orders
                .Where(o => o.CafeId == cafeId && (o.Status == "Cancelled" || o.Status == "Refunded"))
                .AsQueryable();

            if (startDate.HasValue)
                query = query.Where(o => o.OrderDate >= startDate.Value);
            if (endDate.HasValue)
                query = query.Where(o => o.OrderDate <= endDate.Value);

            var orders = await query.OrderByDescending(o => o.OrderDate).ToListAsync();

            return orders.Select(o => new RefundCancelOrderDto
            {
                Id = o.Id,
                OrderDate = o.OrderDate,
                CancelledDate = o.Status == "Cancelled" ? o.UpdatedAt : null,
                CustomerName = o.CustomerName,
                TotalAmount = o.TotalAmount,
                Status = o.Status,
                RefundDate = o.Status == "Refunded" ? o.UpdatedAt : null,
                RefundAmount = o.Status == "Refunded" ? o.TotalAmount : null
            }).ToList();
        }
        #endregion

        public async Task<bool> ProcessRefundAsync(int cafeId, int orderId, decimal refundAmount, string? reason)
        {
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.CafeId == cafeId && o.Id == orderId);

            if (order == null || !order.IsPaid) return false;

            order.Status = "Refunded";
            order.UpdatedAt = DateTime.UtcNow;
            order.Notes = $"Refund: {refundAmount}. Reason: {reason}";

            await _context.SaveChangesAsync();
            return true;
        }
        

        #region Ingredients
        public async Task<IngredientResponseDto> CreateIngredientAsync(int cafeId, IngredientCreateDto request)
        {
            var ingredient = new Ingredient
            {
                CafeId = cafeId,
                Name = request.Name,
                UnitOfMeasure = request.UnitOfMeasure,
                MinStockLevel = request.MinStockLevel,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Ingredients.Add(ingredient);
            await _context.SaveChangesAsync();

            return MapToIngredientResponseDto(ingredient);
        }
        #endregion

        public async Task<List<IngredientResponseDto>> GetIngredientsAsync(int cafeId)
        {
            var ingredients = await _context.Ingredients
                .Where(i => i.CafeId == cafeId)
                .ToListAsync();

            return ingredients.Select(MapToIngredientResponseDto).ToList();
        }

        public async Task<bool> AddDailyIngredientEntryAsync(int cafeId, DailyIngredientEntryDto request)
        {
            if (request == null)
            {
                throw new InvalidOperationException("Daily entry payload is required.");
            }

            var hasPurchases = request.Purchases?.Any(p => p.Quantity > 0 && p.IngredientId > 0) == true;
            var hasUsages = request.Usages?.Any(u => (u.QuantityUsed > 0 || u.QuantityWasted > 0) && u.IngredientId > 0) == true;

            if (!hasPurchases && !hasUsages)
            {
                throw new InvalidOperationException("Daily entry must include at least one valid purchase or usage.");
            }

            var strategy = _context.Database.CreateExecutionStrategy();

            return await strategy.ExecuteAsync(async () =>
            {
                await using var transaction = await _context.Database.BeginTransactionAsync();

                try
                {
                    foreach (var purchase in request.Purchases)
                    {
                        if (purchase.IngredientId <= 0 || purchase.Quantity <= 0) continue;

                        var ingredient = await _context.Ingredients
                            .FirstOrDefaultAsync(i => i.CafeId == cafeId && i.Id == purchase.IngredientId);

                        if (ingredient == null)
                        {
                            throw new InvalidOperationException($"Ingredient {purchase.IngredientId} not found for this cafe.");
                        }

                        _context.IngredientPurchases.Add(new IngredientPurchase
                        {
                            IngredientId = purchase.IngredientId,
                            Quantity = purchase.Quantity,
                            UnitPrice = purchase.UnitPrice,
                            SupplierName = purchase.SupplierName,
                            Notes = purchase.Notes,
                            PurchaseDate = DateTime.UtcNow
                        });

                        ingredient.CurrentStock += purchase.Quantity;
                        ingredient.UpdatedAt = DateTime.UtcNow;
                    }

                    foreach (var usage in request.Usages)
                    {
                        if (usage.IngredientId <= 0 || (usage.QuantityUsed <= 0 && usage.QuantityWasted <= 0)) continue;

                        var ingredient = await _context.Ingredients
                            .FirstOrDefaultAsync(i => i.CafeId == cafeId && i.Id == usage.IngredientId);

                        if (ingredient == null)
                        {
                            throw new InvalidOperationException($"Ingredient {usage.IngredientId} not found for this cafe.");
                        }

                        var today = DateTime.UtcNow.Date;
                        var existingUsage = await _context.IngredientUsages
                            .FirstOrDefaultAsync(iu => iu.IngredientId == usage.IngredientId && iu.UsageDate.Date == today);

                        if (existingUsage != null)
                        {
                            existingUsage.QuantityUsed += usage.QuantityUsed;
                            existingUsage.QuantityWasted += usage.QuantityWasted;

                            if (!string.IsNullOrEmpty(usage.Notes))
                            {
                                existingUsage.Notes = string.IsNullOrEmpty(existingUsage.Notes)
                                    ? usage.Notes
                                    : existingUsage.Notes + " | " + usage.Notes;
                            }
                        }
                        else
                        {
                            _context.IngredientUsages.Add(new IngredientUsage
                            {
                                IngredientId = usage.IngredientId,
                                QuantityUsed = usage.QuantityUsed,
                                QuantityWasted = usage.QuantityWasted,
                                Notes = usage.Notes,
                                UsageDate = today
                            });
                        }

                        ingredient.CurrentStock -= (usage.QuantityUsed + usage.QuantityWasted);
                        ingredient.UpdatedAt = DateTime.UtcNow;
                    }

                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();
                    return true;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    throw new InvalidOperationException("Failed to add daily entry.", ex);
                }
            });
        }
        

        #region CreateAdditional Costs
        public async Task<AdditionalCostResponseDto> CreateAdditionalCostAsync(int cafeId, AdditionalCostCreateDto request)
        {
            var cost = new AdditionalCost
            {
                CafeId = cafeId,
                CostType = request.CostType,
                Amount = request.Amount,
                CostDate = request.CostDate,
                Description = request.Description,
                IsRecurring = request.IsRecurring,
                CreatedAt = DateTime.UtcNow
            };

            _context.AdditionalCosts.Add(cost);
            await _context.SaveChangesAsync();

            return MapToAdditionalCostResponseDto(cost);
        }
        #endregion

        #region Additional Costs
        public async Task<List<AdditionalCostResponseDto>> GetAdditionalCostsAsync(int cafeId, DateTime? startDate, DateTime? endDate)
        {
            var query = _context.AdditionalCosts
                .Where(ac => ac.CafeId == cafeId)
                .AsQueryable();

            if (startDate.HasValue)
                query = query.Where(ac => ac.CostDate >= startDate.Value);
            if (endDate.HasValue)
                query = query.Where(ac => ac.CostDate <= endDate.Value);

            var costs = await query.OrderByDescending(ac => ac.CostDate).ToListAsync();

            return costs.Select(MapToAdditionalCostResponseDto).ToList();
        }
        #endregion

        #region Waiters
        public async Task<List<EmployeeBasicDto>> GetWaitersAsync(int cafeId)
        {
            var waiters = await _context.Employees
                .Where(e => e.CafeId == cafeId && e.Designation == "Waiter" && e.IsActive)
                .OrderBy(e => e.Name)
                .ToListAsync();

            return waiters.Select(e => new EmployeeBasicDto
            {
                Id = e.Id,
                EmployeeId = e.EmployeeId,
                Name = e.Name,
                Designation = e.Designation,
                Shift = e.Shift,
                Salary = e.Salary
            }).ToList();
        }
        #endregion



       
        public async Task<ReservationResponseDto> CreateReservationAsync(int cafeId, ReservationCreateDto request)
        {
            // Check for conflicting reservations
            var conflictingReservation = await _context.Reservations
                .Where(r => r.CafeId == cafeId && r.TableId == request.TableId && r.ReservationDate.Date == request.ReservationDate.Date)
                .Where(r => r.Status == "Confirmed")
                .Where(r => (request.StartTime >= r.StartTime && request.StartTime < r.EndTime) ||
                           (request.EndTime > r.StartTime && request.EndTime <= r.EndTime) ||
                           (request.StartTime <= r.StartTime && request.EndTime >= r.EndTime))
                .FirstOrDefaultAsync();

            if (conflictingReservation != null)
            {
                throw new InvalidOperationException("Table is already reserved for this time period");
            }

            var reservation = new Reservation
            {
                CafeId = cafeId,
                TableId = request.TableId,
                CustomerName = request.CustomerName,
                CustomerPhone = request.CustomerPhone,
                CustomerEmail = request.CustomerEmail,
                ReservationDate = request.ReservationDate,
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                NumberOfGuests = request.NumberOfGuests,
                Notes = request.Notes,
                Status = "Confirmed",
                CreatedAt = DateTime.UtcNow
            };

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            return await MapToReservationResponseDtoAsync(reservation);
        }

        public async Task<List<ReservationResponseDto>> GetReservationsAsync(int cafeId, DateTime? date)
        {
            var query = _context.Reservations
                .Where(r => r.CafeId == cafeId)
                .AsQueryable();

            if (date.HasValue)
                query = query.Where(r => r.ReservationDate.Date == date.Value.Date);

            var reservations = await query
                .Include(r => r.Table)
                .OrderBy(r => r.ReservationDate)
                .ThenBy(r => r.StartTime)
                .ToListAsync();

            var result = new List<ReservationResponseDto>();
            foreach (var r in reservations)
            {
                result.Add(await MapToReservationResponseDtoAsync(r));
            }
            return result;
        }

        public async Task<List<TodaysReservationDto>> GetTodaysReservationsAsync(int cafeId)
        {
            var today = DateTime.UtcNow.Date;
            var reservations = await _context.Reservations
                .Where(r => r.CafeId == cafeId && r.ReservationDate.Date == today && r.Status == "Confirmed")
                .Include(r => r.Table)
                .OrderBy(r => r.StartTime)
                .ToListAsync();

            return reservations.Select(r => new TodaysReservationDto
            {
                Id = r.Id,
                TableNumber = r.Table?.TableNumber ?? "Unknown",
                StartTime = r.StartTime,
                EndTime = r.EndTime,
                CustomerName = r.CustomerName,
                CustomerPhone = r.CustomerPhone,
                NumberOfGuests = r.NumberOfGuests
            }).ToList();
        }

        public async Task<List<TableOverviewDto>> GetTableOverviewAsync(int cafeId, DateTime? date)
        {
            var targetDate = (date ?? DateTime.UtcNow).Date;

            var tables = await _context.Tables
                .Where(t => t.CafeId == cafeId)
                .Include(t => t.Reservations.Where(r => r.ReservationDate.Date == targetDate))
                .OrderBy(t => t.TableNumber)
                .ToListAsync();

            return tables.Select(t =>
            {
                var reservations = t.Reservations
                    .OrderBy(r => r.StartTime)
                    .Select(r => new TableReservationInfoDto
                    {
                        ReservationId = r.Id,
                        CustomerName = r.CustomerName,
                        CustomerPhone = r.CustomerPhone,
                        ReservationDate = r.ReservationDate,
                        StartTime = r.StartTime,
                        EndTime = r.EndTime,
                        NumberOfGuests = r.NumberOfGuests,
                        Status = r.Status
                    })
                    .ToList();

                var status = !t.IsActive
                    ? "Inactive"
                    : reservations.Any(r => r.Status == "Confirmed")
                        ? "Reserved"
                        : "Available";

                return new TableOverviewDto
                {
                    TableId = t.Id,
                    TableNumber = t.TableNumber,
                    Capacity = t.Capacity,
                    IsActive = t.IsActive,
                    Status = status,
                    Reservations = reservations
                };
            }).ToList();
        }

        public async Task<bool> CancelReservationAsync(int cafeId, int reservationId)
        {
            var reservation = await _context.Reservations
                .FirstOrDefaultAsync(r => r.CafeId == cafeId && r.Id == reservationId);

            if (reservation == null) return false;

            reservation.Status = "Cancelled";
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<SalaryPaymentResponseDto> ProcessSalaryPaymentAsync(int cafeId, SalaryPaymentCreateDto request)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.CafeId == cafeId && e.Id == request.EmployeeId);

            if (employee == null) throw new InvalidOperationException("Employee not found");

            // Check if salary already paid for this month
            var existingPayment = await _context.SalaryPayments
                .FirstOrDefaultAsync(sp => sp.EmployeeId == request.EmployeeId && sp.Month == request.Month && sp.Year == request.Year);

            if (existingPayment != null && existingPayment.IsPaid)
            {
                throw new InvalidOperationException("Salary already paid for this month");
            }

            SalaryPayment payment;
            if (existingPayment != null)
            {
                payment = existingPayment;
                payment.Amount = request.Amount;
                payment.IsPaid = true;
                payment.PaidDate = DateTime.UtcNow;
                payment.PaymentMethod = request.PaymentMethod;
                payment.Notes = request.Notes;
            }
            else
            {
                payment = new SalaryPayment
                {
                    EmployeeId = request.EmployeeId,
                    Month = request.Month,
                    Year = request.Year,
                    Amount = request.Amount,
                    IsPaid = true,
                    PaidDate = DateTime.UtcNow,
                    PaymentMethod = request.PaymentMethod,
                    Notes = request.Notes,
                    CreatedAt = DateTime.UtcNow
                };
                _context.SalaryPayments.Add(payment);
            }

            await _context.SaveChangesAsync();

            return new SalaryPaymentResponseDto
            {
                Id = payment.Id,
                EmployeeName = employee.Name,
                EmployeeId = employee.EmployeeId,
                Month = payment.Month,
                Year = payment.Year,
                Amount = payment.Amount,
                IsPaid = payment.IsPaid,
                PaidDate = payment.PaidDate,
                PaymentMethod = payment.PaymentMethod
            };
        }

        public async Task<List<SalaryPaymentResponseDto>> GetSalaryPaymentsAsync(int cafeId, int month, int year)
        {
            var payments = await _context.SalaryPayments
                .Where(sp => sp.Employee.CafeId == cafeId && sp.Month == month && sp.Year == year)
                .Include(sp => sp.Employee)
                .ToListAsync();

            return payments.Select(sp => new SalaryPaymentResponseDto
            {
                Id = sp.Id,
                EmployeeName = sp.Employee.Name,
                EmployeeId = sp.Employee.EmployeeId,
                Month = sp.Month,
                Year = sp.Year,
                Amount = sp.Amount,
                IsPaid = sp.IsPaid,
                PaidDate = sp.PaidDate,
                PaymentMethod = sp.PaymentMethod
            }).ToList();
        }
        



        private async Task<ItemResponseDto> MapToItemResponseDtoAsync(MenuItem item)
        {
            var category = item.Category ?? await _context.ItemCategories.FindAsync(item.CategoryId);

            return new ItemResponseDto
            {
                Id = item.Id,
                Name = item.Name,
                Description = item.Description,
                UnitPrice = item.UnitPrice,
                ImageUrl = item.ImageUrl,
                PriceRange = item.PriceRange,
                CategoryName = category?.Name,
                IsAvailable = item.IsAvailable
            };
        }

        private OrderResponseDto MapToOrderResponseDto(Order order)
        {
            return new OrderResponseDto
            {
                Id = order.Id,
                OrderType = order.OrderType,
                TableNumber = order.Table?.TableNumber,
                WaiterName = order.Waiter?.Name,
                CustomerName = order.CustomerName,
                CustomerPhone = order.CustomerPhone,
                CustomerAddress = order.CustomerAddress,
                OrderDate = order.OrderDate,
                Status = order.Status,
                TotalAmount = order.TotalAmount,
                IsPaid = order.IsPaid,
                OrderItems = order.OrderItems.Select(oi => new OrderItemResponseDto
                {
                    Id = oi.Id,
                    ItemName = oi.MenuItem.Name,
                    Quantity = oi.Quantity,
                    UnitPrice = oi.UnitPrice,
                    TotalPrice = oi.TotalPrice
                }).ToList()
            };
        }

        private IngredientResponseDto MapToIngredientResponseDto(Ingredient ingredient)
        {
            return new IngredientResponseDto
            {
                Id = ingredient.Id,
                Name = ingredient.Name,
                UnitOfMeasure = ingredient.UnitOfMeasure,
                CurrentStock = ingredient.CurrentStock,
                MinStockLevel = ingredient.MinStockLevel
            };
        }

        private AdditionalCostResponseDto MapToAdditionalCostResponseDto(AdditionalCost cost)
        {
            return new AdditionalCostResponseDto
            {
                Id = cost.Id,
                CostType = cost.CostType,
                Amount = cost.Amount,
                CostDate = cost.CostDate,
                Description = cost.Description,
                IsRecurring = cost.IsRecurring
            };
        }

        private async Task<ReservationResponseDto> MapToReservationResponseDtoAsync(Reservation reservation)
        {
            var table = reservation.Table ?? await _context.Tables.FindAsync(reservation.TableId);

            return new ReservationResponseDto
            {
                Id = reservation.Id,
                TableNumber = table?.TableNumber ?? "Unknown",
                CustomerName = reservation.CustomerName,
                CustomerPhone = reservation.CustomerPhone,
                ReservationDate = reservation.ReservationDate,
                StartTime = reservation.StartTime,
                EndTime = reservation.EndTime,
                NumberOfGuests = reservation.NumberOfGuests,
                Status = reservation.Status,
                CreatedAt = reservation.CreatedAt
            };
        }


        public async Task<bool> DeleteItemAsync(int cafeId, int itemId)
        {
            var item = await _context.MenuItems
                .FirstOrDefaultAsync(mi => mi.CafeId == cafeId && mi.Id == itemId);

            if (item == null) return false;

            _context.MenuItems.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }



    }
}