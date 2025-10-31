using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockManager.DataContext.Migrations
{
    /// <inheritdoc />
    public partial class AddStockFinancialsAsReported : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StockReports",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    StockId = table.Column<int>(type: "INTEGER", nullable: false),
                    AccessNumber = table.Column<string>(type: "TEXT", nullable: false),
                    Year = table.Column<int>(type: "INTEGER", nullable: false),
                    Quarter = table.Column<int>(type: "INTEGER", nullable: false),
                    StartDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    EndDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    FiledDate = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockReports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StockReports_Stocks_StockId",
                        column: x => x.StockId,
                        principalTable: "Stocks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StockReportItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    StockReportId = table.Column<int>(type: "INTEGER", nullable: false),
                    ReportSection = table.Column<string>(type: "TEXT", nullable: false),
                    Concept = table.Column<string>(type: "TEXT", nullable: false),
                    Unit = table.Column<string>(type: "TEXT", nullable: false),
                    Label = table.Column<string>(type: "TEXT", nullable: false),
                    Value = table.Column<double>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StockReportItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StockReportItems_StockReports_StockReportId",
                        column: x => x.StockReportId,
                        principalTable: "StockReports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StockReportItems_StockReportId",
                table: "StockReportItems",
                column: "StockReportId");

            migrationBuilder.CreateIndex(
                name: "IX_StockReports_StockId",
                table: "StockReports",
                column: "StockId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StockReportItems");

            migrationBuilder.DropTable(
                name: "StockReports");
        }
    }
}
