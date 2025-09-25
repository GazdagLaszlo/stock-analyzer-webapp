using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockManager.DataContext.Migrations
{
    /// <inheritdoc />
    public partial class AddPortfolioItemTransactionRelations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PortfolioItemId",
                table: "Transactions",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateOnly>(
                name: "UpdatedDate",
                table: "StockData",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_PortfolioItemId",
                table: "Transactions",
                column: "PortfolioItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_PortfolioItems_PortfolioItemId",
                table: "Transactions",
                column: "PortfolioItemId",
                principalTable: "PortfolioItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_PortfolioItems_PortfolioItemId",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_PortfolioItemId",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "PortfolioItemId",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "UpdatedDate",
                table: "StockData");
        }
    }
}
