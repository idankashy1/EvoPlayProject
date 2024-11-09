using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EvoPlay.Migrations
{
    public partial class RemoveUserId1FromBookingGroup : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BookingGroups_Users_UserId1",
                table: "BookingGroups");

            migrationBuilder.DropTable(
                name: "Payments");

            migrationBuilder.DropIndex(
                name: "IX_BookingGroups_UserId1",
                table: "BookingGroups");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "BookingGroups");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId1",
                table: "BookingGroups",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Payments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BookingGroupId = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PaymentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Payments_BookingGroups_BookingGroupId",
                        column: x => x.BookingGroupId,
                        principalTable: "BookingGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BookingGroups_UserId1",
                table: "BookingGroups",
                column: "UserId1");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_BookingGroupId",
                table: "Payments",
                column: "BookingGroupId");

            migrationBuilder.AddForeignKey(
                name: "FK_BookingGroups_Users_UserId1",
                table: "BookingGroups",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
