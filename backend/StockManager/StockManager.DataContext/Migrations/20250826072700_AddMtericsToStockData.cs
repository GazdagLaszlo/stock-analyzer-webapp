using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockManager.DataContext.Migrations
{
    /// <inheritdoc />
    public partial class AddMtericsToStockData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "EPS",
                table: "StockData",
                type: "REAL",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "REAL");

            migrationBuilder.AddColumn<double>(
                name: "DebtToEquityRatio",
                table: "StockData",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "DividendYield",
                table: "StockData",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "PriceToBookRatio",
                table: "StockData",
                type: "REAL",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "PriceToEarningsRatio",
                table: "StockData",
                type: "REAL",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DebtToEquityRatio",
                table: "StockData");

            migrationBuilder.DropColumn(
                name: "DividendYield",
                table: "StockData");

            migrationBuilder.DropColumn(
                name: "PriceToBookRatio",
                table: "StockData");

            migrationBuilder.DropColumn(
                name: "PriceToEarningsRatio",
                table: "StockData");

            migrationBuilder.AlterColumn<double>(
                name: "EPS",
                table: "StockData",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0,
                oldClrType: typeof(double),
                oldType: "REAL",
                oldNullable: true);
        }
    }
}
