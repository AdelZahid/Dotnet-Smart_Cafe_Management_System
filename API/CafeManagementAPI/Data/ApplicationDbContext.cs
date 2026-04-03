using CafeManagementAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CafeManagementAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<CafeProfile> CafeProfiles { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<EmployeeRegistrationRequest> EmployeeRegistrationRequests { get; set; }
        public DbSet<Attendance> Attendances { get; set; }
        public DbSet<SalaryPayment> SalaryPayments { get; set; }
        public DbSet<ItemCategory> ItemCategories { get; set; }
        public DbSet<MenuItem> MenuItems { get; set; }
        public DbSet<Table> Tables { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Ingredient> Ingredients { get; set; }
        public DbSet<IngredientPurchase> IngredientPurchases { get; set; }
        public DbSet<IngredientUsage> IngredientUsages { get; set; }
        public DbSet<AdditionalCost> AdditionalCosts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.EmployeeId)
                .IsUnique();

            modelBuilder.Entity<Employee>()
                .HasIndex(e => e.UserId)
                .IsUnique()
                .HasFilter("[UserId] IS NOT NULL");

            modelBuilder.Entity<EmployeeRegistrationRequest>()
                .HasIndex(r => r.Email);

            modelBuilder.Entity<Table>()
                .HasIndex(t => new { t.CafeId, t.TableNumber })
                .IsUnique();

            modelBuilder.Entity<Attendance>()
                .HasIndex(a => new { a.EmployeeId, a.Date })
                .IsUnique();

            modelBuilder.Entity<SalaryPayment>()
                .HasIndex(sp => new { sp.EmployeeId, sp.Month, sp.Year })
                .IsUnique();

            modelBuilder.Entity<IngredientUsage>()
                .HasIndex(iu => new { iu.IngredientId, iu.UsageDate })
                .IsUnique();

            modelBuilder.Entity<IngredientUsage>()
                .Property(iu => iu.QuantityWasted)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<AdditionalCost>()
                .Property(ac => ac.Amount)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<SalaryPayment>()
                .Property(sp => sp.Amount)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<CafeProfile>()
                .HasOne(cp => cp.Owner)
                .WithOne(u => u.CafeProfile)
                .HasForeignKey<CafeProfile>(cp => cp.OwnerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Employee>()
                .HasOne(e => e.Cafe)
                .WithMany(cp => cp.Employees)
                .HasForeignKey(e => e.CafeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Employee>()
                .HasOne(e => e.User)
                .WithOne(u => u.Employee)
                .HasForeignKey<Employee>(e => e.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<MenuItem>()
                .HasOne(mi => mi.Cafe)
                .WithMany(cp => cp.MenuItems)
                .HasForeignKey(mi => mi.CafeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MenuItem>()
                .HasOne(mi => mi.Category)
                .WithMany(c => c.MenuItems)
                .HasForeignKey(mi => mi.CategoryId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<ItemCategory>()
                .HasOne(ic => ic.Cafe)
                .WithMany(cp => cp.ItemCategories)
                .HasForeignKey(ic => ic.CafeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Table>()
                .HasOne(t => t.Cafe)
                .WithMany(cp => cp.Tables)
                .HasForeignKey(t => t.CafeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Cafe)
                .WithMany(cp => cp.Orders)
                .HasForeignKey(o => o.CafeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Table)
                .WithMany(t => t.Orders)
                .HasForeignKey(o => o.TableId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.Waiter)
                .WithMany(e => e.OrdersTaken)
                .HasForeignKey(o => o.WaiterId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.MenuItem)
                .WithMany(mi => mi.OrderItems)
                .HasForeignKey(oi => oi.MenuItemId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Order)
                .WithMany(o => o.Payments)
                .HasForeignKey(p => p.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Ingredient>()
                .HasOne(i => i.Cafe)
                .WithMany(cp => cp.Ingredients)
                .HasForeignKey(i => i.CafeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<IngredientPurchase>()
                .HasOne(ip => ip.Ingredient)
                .WithMany(i => i.Purchases)
                .HasForeignKey(ip => ip.IngredientId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<IngredientUsage>()
                .HasOne(iu => iu.Ingredient)
                .WithMany(i => i.Usages)
                .HasForeignKey(iu => iu.IngredientId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AdditionalCost>()
                .HasOne(ac => ac.Cafe)
                .WithMany(cp => cp.AdditionalCosts)
                .HasForeignKey(ac => ac.CafeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Attendance>()
                .HasOne(a => a.Employee)
                .WithMany(e => e.Attendances)
                .HasForeignKey(a => a.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SalaryPayment>()
                .HasOne(sp => sp.Employee)
                .WithMany(e => e.SalaryPayments)
                .HasForeignKey(sp => sp.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Cafe)
                .WithMany(cp => cp.Reservations)
                .HasForeignKey(r => r.CafeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Reservation>()
                .HasOne(r => r.Table)
                .WithMany(t => t.Reservations)
                .HasForeignKey(r => r.TableId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<EmployeeRegistrationRequest>()
                .HasIndex(r => r.Email);

            modelBuilder.Entity<EmployeeRegistrationRequest>()
                .HasIndex(r => r.CafeEmail);
        }
    }
}