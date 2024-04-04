using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EvoPlay.Data.Migrations
{
    public partial class UpdatePackageStructure : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Price",
                table: "Packages");

            migrationBuilder.RenameColumn(
                name: "Duration",
                table: "Packages",
                newName: "MinimumTime");

            migrationBuilder.AddColumn<int>(
                name: "MinimumPeople",
                table: "Packages",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Packages",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MinimumPeople",
                table: "Packages");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Packages");

            migrationBuilder.RenameColumn(
                name: "MinimumTime",
                table: "Packages",
                newName: "Duration");

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "Packages",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
