using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EvoPlay.Migrations
{
    public partial class AddCurrentPointsToUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CurrentPoints",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrentPoints",
                table: "Users");
        }
    }
}
