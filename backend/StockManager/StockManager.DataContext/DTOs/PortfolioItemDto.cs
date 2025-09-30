using StockManager.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.DataContext.DTOs
{
    public class PortfolioItemDto
    {
        public int Id { get; set; }
        public StockDto Stock { get; set; }
        public double Quantity { get; set; }
        public double AveragePurchasePrice { get; set; }
        public double TargetPrice { get; set; }
        public string Note { get; set; }
        public double ProfitLoss { get; set; }
        public List<TransactionDto> Transactions { get; set; } = new List<TransactionDto>();
    }

    public class PortfolioItemCreateDto
    {
        public int PortfolioId { get; set; }
        public int StockId { get; set; }
        public double Quantity { get; set; }
        public double AveragePurchasePrice { get; set; }
        public double TargetPrice { get; set; }
        public string Note { get; set; }
    }

    public class PortfolioItemUpdateDto
    {
        public int StockId { get; set; }
        public double Quantity { get; set; }
        public double AveragePurchasePrice { get; set; }
        public double TargetPrice { get; set; }
        public string Note { get; set; }
    }
}
