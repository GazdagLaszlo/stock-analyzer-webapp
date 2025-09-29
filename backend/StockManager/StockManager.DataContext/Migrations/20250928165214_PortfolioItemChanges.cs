using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockManager.DataContext.Migrations
{
    /// <inheritdoc />
    public partial class PortfolioItemChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfitLoss",
                table: "PortfolioItems");

            migrationBuilder.DropColumn(
                name: "PurchasePrice",
                table: "PortfolioItems");

            migrationBuilder.AlterColumn<double>(
                name: "TargetPrice",
                table: "PortfolioItems",
                type: "REAL",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "REAL");

            migrationBuilder.AlterColumn<string>(
                name: "Note",
                table: "PortfolioItems",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "TargetPrice",
                table: "PortfolioItems",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0,
                oldClrType: typeof(double),
                oldType: "REAL",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Note",
                table: "PortfolioItems",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddColumn<double>(
                name: "ProfitLoss",
                table: "PortfolioItems",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "PurchasePrice",
                table: "PortfolioItems",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}
