using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockManager.DataContext.Migrations
{
    /// <inheritdoc />
    public partial class UpdateStockBaseData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Website",
                table: "Stocks",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Website",
                table: "Stocks");
        }
    }
}
