using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockManager.DataContext.Migrations
{
    /// <inheritdoc />
    public partial class SetPortfolioItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "AveragePurchasePrice",
                table: "PortfolioItems",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AveragePurchasePrice",
                table: "PortfolioItems");
        }
    }
}
