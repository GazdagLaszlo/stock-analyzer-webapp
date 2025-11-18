using Microsoft.EntityFrameworkCore;
using StockManager.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.DataContext.Context
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<Portfolio> Portfolios { get; set; }
        public DbSet<PortfolioItem> PortfolioItems { get; set; }
        public DbSet<Stock> Stocks { get; set; }
        public DbSet<StockData> StockData { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<User> Users { get; set; }        
        public DbSet<WatchList> WatchLists { get; set; }
        public DbSet<WatchListItem> WatchListItems { get; set; }
        public DbSet<StockReport> StockReports { get; set; }
        public DbSet<StockReportItem> StockReportItems { get; set; }
        public DbSet<StockDataItem> StockDataItems { get; set; }
    }
}
