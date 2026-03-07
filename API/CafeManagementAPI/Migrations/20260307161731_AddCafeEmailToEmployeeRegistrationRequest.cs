using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CafeManagementAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddCafeEmailToEmployeeRegistrationRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Sex",
                table: "EmployeeRegistrationRequests",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(10)",
                oldMaxLength: 10,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CafeEmail",
                table: "EmployeeRegistrationRequests",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeRegistrationRequests_CafeEmail",
                table: "EmployeeRegistrationRequests",
                column: "CafeEmail");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_EmployeeRegistrationRequests_CafeEmail",
                table: "EmployeeRegistrationRequests");

            migrationBuilder.DropColumn(
                name: "CafeEmail",
                table: "EmployeeRegistrationRequests");

            migrationBuilder.AlterColumn<string>(
                name: "Sex",
                table: "EmployeeRegistrationRequests",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldNullable: true);
        }
    }
}
