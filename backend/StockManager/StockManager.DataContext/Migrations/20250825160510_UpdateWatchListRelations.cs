using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockManager.DataContext.Migrations
{
    /// <inheritdoc />
    public partial class UpdateWatchListRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WatchListItems_WatchLists_WatchListId",
                table: "WatchListItems");

            migrationBuilder.AlterColumn<int>(
                name: "WatchListId",
                table: "WatchListItems",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_WatchListItems_WatchLists_WatchListId",
                table: "WatchListItems",
                column: "WatchListId",
                principalTable: "WatchLists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WatchListItems_WatchLists_WatchListId",
                table: "WatchListItems");

            migrationBuilder.AlterColumn<int>(
                name: "WatchListId",
                table: "WatchListItems",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddForeignKey(
                name: "FK_WatchListItems_WatchLists_WatchListId",
                table: "WatchListItems",
                column: "WatchListId",
                principalTable: "WatchLists",
                principalColumn: "Id");
        }
    }
}
