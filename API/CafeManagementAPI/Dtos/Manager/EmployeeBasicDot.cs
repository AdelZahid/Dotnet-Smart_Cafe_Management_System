namespace CafeManagementAPI.Dtos.Manager
{
    public class EmployeeBasicDto
    {
        public int Id { get; set; }
        public string EmployeeId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Designation { get; set; } = string.Empty;
        public string? Shift { get; set; }
        public decimal Salary { get; set; }
    }
}