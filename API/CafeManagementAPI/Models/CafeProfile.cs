using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeManagementAPI.Models
{
    public class CafeProfile
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Owner")]
        public int OwnerId { get; set; }

        [Required]
        [StringLength(200)]
        public string CafeName { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string OwnerName { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string Location { get; set; } = string.Empty;

        [StringLength(50)]
        public string? Phone { get; set; }

        [EmailAddress]
        [StringLength(255)]
        public string? Email { get; set; }

        [StringLength(500)]
        public string? ImageUrl { get; set; }

        [StringLength(1000)]
        public string? Description { get; set; }

        public TimeSpan? OpeningTime { get; set; }

        public TimeSpan? ClosingTime { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual User Owner { get; set; } = null!;
        public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();
        public virtual ICollection<MenuItem> MenuItems { get; set; } = new List<MenuItem>();
        public virtual ICollection<ItemCategory> ItemCategories { get; set; } = new List<ItemCategory>();
        public virtual ICollection<Table> Tables { get; set; } = new List<Table>();
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
        public virtual ICollection<Ingredient> Ingredients { get; set; } = new List<Ingredient>();
        public virtual ICollection<AdditionalCost> AdditionalCosts { get; set; } = new List<AdditionalCost>();
        public virtual ICollection<Reservation> Reservations { get; set; } = new List<Reservation>();
    }
}
