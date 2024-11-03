using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EvoPlay.Migrations
{
    public partial class AddNumberOfPlayersToBooking : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "NumberOfPlayers",
                table: "Bookings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UserId1",
                table: "BookingGroups",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_BookingGroups_UserId1",
                table: "BookingGroups",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_BookingGroups_Users_UserId1",
                table: "BookingGroups",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BookingGroups_Users_UserId1",
                table: "BookingGroups");

            migrationBuilder.DropIndex(
                name: "IX_BookingGroups_UserId1",
                table: "BookingGroups");

            migrationBuilder.DropColumn(
                name: "NumberOfPlayers",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "BookingGroups");
        }
    }
}
