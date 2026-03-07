using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeManagementAPI.Models
{
    public class Employee
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("User")]
        public int? UserId { get; set; }

        [Required]
        [ForeignKey("Cafe")]
        public int CafeId { get; set; }

        [Required]
        [StringLength(20)]
        public string EmployeeId { get; set; } = string.Empty; // Unique ID like EMP12345

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Range(18, 70)]
        public int? Age { get; set; }

        [StringLength(10)]
        public string? Sex { get; set; } // Male, Female, Other

        [StringLength(500)]
        public string? Address { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        [StringLength(50)]
        public string? Phone { get; set; }

        [StringLength(500)]
        public string? ImageUrl { get; set; }

        [Required]
        [StringLength(100)]
        public string Designation { get; set; } = string.Empty; // Manager, Waiter, Chef, Cashier

        [StringLength(50)]
        public string? Shift { get; set; } // Morning, Evening, Night, FullDay

        [Column(TypeName = "decimal(18,2)")]
        public decimal Salary { get; set; } = 0;

        public DateTime JoiningDate { get; set; } = DateTime.UtcNow;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual User? User { get; set; }
        public virtual CafeProfile Cafe { get; set; } = null!;
        public virtual ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
        public virtual ICollection<SalaryPayment> SalaryPayments { get; set; } = new List<SalaryPayment>();
        public virtual ICollection<Order> OrdersTaken { get; set; } = new List<Order>();
    }
}
