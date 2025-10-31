using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockManager.DataContext.Migrations
{
    /// <inheritdoc />
    public partial class StockDataUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "StockData");

            migrationBuilder.DropColumn(
                name: "DebtToEquityRatio",
                table: "StockData");

            migrationBuilder.DropColumn(
                name: "DividendYield",
                table: "StockData");

            migrationBuilder.DropColumn(
                name: "EPS",
                table: "StockData");

            migrationBuilder.DropColumn(
                name: "PriceToBookRatio",
                table: "StockData");

            migrationBuilder.DropColumn(
                name: "PriceToEarningsRatio",
                table: "StockData");

            migrationBuilder.AddColumn<double>(
                name: "Beta",
                table: "StockData",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "CashFlowPerShareTTM",
                table: "StockData",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "CurrentDividendYieldTTM",
                table: "StockData",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "DividendPerShareTTM",
                table: "StockData",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "EpsTTM",
                table: "StockData",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "PETTM",
                table: "StockData",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "PSTTM",
                table: "StockData",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "PriceToBookvalue",
                table: "StockData",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "TenDayAverageTradingVolume",
                table: "StockData",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "ThreeMonthAverageTradingVolume",
                table: "StockData",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "YearHigh",
                table: "StockData",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "YearLow",
                table: "StockData",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "longTermDebtToEquityAnnual",
                table: "StockData",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Beta",
                table: "StockData");

            migrationBuilder.DropColumn(
                name: "CashFlowPerShareTTM",
                table: "StockData");

            migrationBuilder.DropColumn(
                name: "CurrentDividendYieldTTM",
                table: "StockData");

            migrationBuilder.DropColumn(
                name: "DividendPerShareTTM",
                table: "StockData");

            migrationBuilder.DropColumn(
                name: "EpsTTM",
                table: "StockData");

            migrationBuilder.DropColumn(
                name: "PETTM",
                table: "StockData");

            migrationBuilder.DropColumn(
                name: "PSTTM",
                table: "StockData");

            migrationBuilder.DropColumn(
                name: "PriceToBookvalue",
                table: "StockData");

            migrationBuilder.DropColumn(
                name: "TenDayAverageTradingVolume",
                table: "StockData");

            migrationBuilder.DropColumn(
                name: "ThreeMonthAverageTradingVolume",
                table: "StockData");

            migrationBuilder.DropColumn(
                name: "YearHigh",
                table: "StockData");

            migrationBuilder.DropColumn(
                name: "YearLow",
                table: "StockData");

            migrationBuilder.DropColumn(
                name: "longTermDebtToEquityAnnual",
                table: "StockData");

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "StockData",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

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
                name: "EPS",
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
    }
}
