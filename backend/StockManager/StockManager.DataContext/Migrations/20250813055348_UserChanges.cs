using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockManager.DataContext.Migrations
{
    /// <inheritdoc />
    public partial class UserChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "WatchListId",
                table: "Users",
                newName: "Role");

            migrationBuilder.CreateIndex(
                name: "IX_WatchLists_UserId",
                table: "WatchLists",
                column: "UserId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_WatchLists_Users_UserId",
                table: "WatchLists",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WatchLists_Users_UserId",
                table: "WatchLists");

            migrationBuilder.DropIndex(
                name: "IX_WatchLists_UserId",
                table: "WatchLists");

            migrationBuilder.RenameColumn(
                name: "Role",
                table: "Users",
                newName: "WatchListId");
        }
    }
}
