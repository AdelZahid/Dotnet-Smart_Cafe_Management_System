using CafeManagementAPI.Data;
using CafeManagementAPI.Dtos.Waiter;
using CafeManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CafeManagementAPI.Services
{
    public interface IWaiterService
    {
        // Menu
        Task<List<MenuItemForWaiterDto>> GetAvailableMenuItemsAsync(int cafeId);

        // Orders
        Task<WaiterOrderListDto> CreateOrderAsync(int cafeId, int waiterId, CreateOrderDto request);
        Task<List<WaiterOrderListDto>> GetMyOrdersAsync(int waiterId);
        Task<bool> UpdateOrderStatusAsync(int orderId, int waiterId, string status);

        // Payments
        Task<List<ServedOrderForPaymentDto>> GetServedOrdersForPaymentAsync(int waiterId);
        Task<PaymentResponseDto> ProcessPaymentAsync(int waiterId, PaymentCreateDto request);
        Task<bool> ProcessRefundAsync(int orderId, int waiterId, string? reason);
    }

    public class WaiterService : IWaiterService
    {
        private readonly ApplicationDbContext _context;

        public WaiterService(ApplicationDbContext context)
        {
            _context = context;
        }

        #region Menu
        public async Task<List<MenuItemForWaiterDto>> GetAvailableMenuItemsAsync(int cafeId)
        {
            var items = await _context.MenuItems
                .Where(mi => mi.CafeId == cafeId && mi.IsAvailable)
                .Include(mi => mi.Category)
                .OrderBy(mi => mi.CategoryId)
                .ThenBy(mi => mi.Name)
                .ToListAsync();

            return items.Select(mi => new MenuItemForWaiterDto
            {
                Id = mi.Id,
                Name = mi.Name,
                Description = mi.Description,
                UnitPrice = mi.UnitPrice,
                ImageUrl = mi.ImageUrl,
                CategoryName = mi.Category?.Name
            }).ToList();
        }
        #endregion

        #region Orders
        public async Task<WaiterOrderListDto> CreateOrderAsync(int cafeId, int waiterId, CreateOrderDto request)
        {
            // Validate items
            var menuItemIds = request.Items.Select(i => i.MenuItemId).ToList();
            var menuItems = await _context.MenuItems
                .Where(mi => mi.CafeId == cafeId && menuItemIds.Contains(mi.Id))
                .ToListAsync();

            if (menuItems.Count != menuItemIds.Count)
            {
                throw new InvalidOperationException("Some menu items are invalid or not available");
            }

            // Calculate total amount
            decimal totalAmount = 0;
            var orderItems = new List<OrderItem>();

            foreach (var item in request.Items)
            {
                var menuItem = menuItems.First(mi => mi.Id == item.MenuItemId);
                var unitPrice = menuItem.UnitPrice;
                totalAmount += unitPrice * item.Quantity;

                orderItems.Add(new OrderItem
                {
                    MenuItemId = item.MenuItemId,
                    Quantity = item.Quantity,
                    UnitPrice = unitPrice,
                    Notes = item.Notes,
                    CreatedAt = DateTime.UtcNow
                });
            }

            // Create order
            var order = new Order
            {
                CafeId = cafeId,
                TableId = request.TableId,
                WaiterId = waiterId,
                OrderType = request.OrderType,
                CustomerName = request.CustomerName,
                CustomerPhone = request.CustomerPhone,
                CustomerAddress = request.CustomerAddress,
                OrderDate = DateTime.UtcNow,
                Status = "Pending",
                TotalAmount = totalAmount,
                IsPaid = false,
                Notes = request.Notes,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                OrderItems = orderItems
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            // Load related data for response
            await _context.Entry(order)
                .Reference(o => o.Table)
                .LoadAsync();

            await _context.Entry(order)
                .Collection(o => o.OrderItems)
                .Query()
                .Include(oi => oi.MenuItem)
                .LoadAsync();

            return MapToWaiterOrderListDto(order);
        }

        public async Task<List<WaiterOrderListDto>> GetMyOrdersAsync(int waiterId)
        {
            var orders = await _context.Orders
                .Where(o => o.WaiterId == waiterId && o.Status != "Cancelled" && o.Status != "Refunded")
                .Include(o => o.Table)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.MenuItem)
                .OrderByDescending(o => o.Status == "Ready") // Ready orders first
                .ThenBy(o => o.OrderDate) // Then by order date (oldest first)
                .ToListAsync();

            return orders.Select(MapToWaiterOrderListDto).ToList();
        }

        public async Task<bool> UpdateOrderStatusAsync(int orderId, int waiterId, string status)
        {
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.Id == orderId && o.WaiterId == waiterId);

            if (order == null) return false;

            // Validate status transition
            var validTransitions = new Dictionary<string, List<string>>
            {
                { "Pending", new List<string> { "Processing", "Cancelled" } },
                { "Processing", new List<string> { "Ready", "Cancelled" } },
                { "Ready", new List<string> { "Served" } },
                { "Served", new List<string> { } }
            };

            if (!validTransitions.ContainsKey(order.Status) || !validTransitions[order.Status].Contains(status))
            {
                return false;
            }

            order.Status = status;
            order.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }
        #endregion

        #region Payments
        public async Task<List<ServedOrderForPaymentDto>> GetServedOrdersForPaymentAsync(int waiterId)
        {
            var orders = await _context.Orders
                .Where(o => o.WaiterId == waiterId && o.Status == "Served" && !o.IsPaid)
                .Include(o => o.Table)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.MenuItem)
                .OrderByDescending(o => o.UpdatedAt)
                .ToListAsync();

            return orders.Select(o => new ServedOrderForPaymentDto
            {
                Id = o.Id,
                TableNumber = o.Table?.TableNumber,
                CustomerName = o.CustomerName,
                TotalAmount = o.TotalAmount,
                ServedDate = o.UpdatedAt,
                Items = o.OrderItems.Select(oi => new OrderItemSummaryDto
                {
                    ItemName = oi.MenuItem.Name,
                    Quantity = oi.Quantity
                }).ToList()
            }).ToList();
        }

        public async Task<PaymentResponseDto> ProcessPaymentAsync(int waiterId, PaymentCreateDto request)
        {
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.Id == request.OrderId && o.WaiterId == waiterId);

            if (order == null)
            {
                throw new InvalidOperationException("Order not found");
            }

            if (order.IsPaid)
            {
                throw new InvalidOperationException("Order is already paid");
            }

            // Create payment record
            var payment = new Payment
            {
                OrderId = request.OrderId,
                Amount = request.Amount,
                PaymentMethod = request.PaymentMethod,
                TransactionId = request.TransactionId,
                Notes = request.Notes,
                PaymentDate = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            _context.Payments.Add(payment);

            // Update order
            order.IsPaid = true;
            order.Status = "Paid";
            order.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new PaymentResponseDto
            {
                Id = payment.Id,
                OrderId = payment.OrderId,
                Amount = payment.Amount,
                PaymentMethod = payment.PaymentMethod,
                PaymentDate = payment.PaymentDate,
                TransactionId = payment.TransactionId
            };
        }

        public async Task<bool> ProcessRefundAsync(int orderId, int waiterId, string? reason)
        {
            var order = await _context.Orders
                .FirstOrDefaultAsync(o => o.Id == orderId && o.WaiterId == waiterId);

            if (order == null || !order.IsPaid)
            {
                return false;
            }

            order.Status = "Refunded";
            order.UpdatedAt = DateTime.UtcNow;
            order.Notes = $"Refund processed. Reason: {reason}";

            await _context.SaveChangesAsync();
            return true;
        }
        #endregion

        #region Helper Methods
        private WaiterOrderListDto MapToWaiterOrderListDto(Order order)
        {
            return new WaiterOrderListDto
            {
                Id = order.Id,
                TableNumber = order.Table?.TableNumber,
                Status = order.Status,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                Items = order.OrderItems.Select(oi => new OrderItemSummaryDto
                {
                    ItemName = oi.MenuItem.Name,
                    Quantity = oi.Quantity
                }).ToList()
            };
        }
        #endregion
    }
}
