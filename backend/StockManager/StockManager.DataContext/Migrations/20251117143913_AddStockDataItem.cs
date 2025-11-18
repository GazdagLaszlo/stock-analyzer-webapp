using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockManager.DataContext.Migrations
{
    /// <inheritdoc />
    public partial class AddStockDataItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StockDataItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Period = table.Column<DateOnly>(type: "TEXT", nullable: true),
                    PeriodType = table.Column<int>(type: "INTEGER", nullable: false),
                    V = table.Column<decimal>(type: "TEXT", nullable: true),
                    MetricName = table.Column<string>(type: "TEXT", nullable: false),
                    StockDataId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockDataItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StockDataItems_StockData_StockDataId",
                        column: x => x.StockDataId,
                        principalTable: "StockData",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StockDataItems_StockDataId",
                table: "StockDataItems",
                column: "StockDataId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StockDataItems");
        }
    }
}
