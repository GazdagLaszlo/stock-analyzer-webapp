using StockManager.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.DataContext.DTOs
{
    public class TransactionCreateDto
    {
        public int StockId { get; set; }
        public double Price { get; set; }
        public double Quantity { get; set; }
        public DateTime Date { get; set; }
        public TransactionType TransactionType { get; set; }
        public double? Fee { get; set; }
        public string? Note { get; set; }
        public int PortfolioId { get; set; }
        public double RealizedProfit {  get; set; }
    }
    public class TransactionDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public StockDto Stock { get; set; }
        public double Price { get; set; }
        public double Quantity { get; set; }
        public DateTime Date { get; set; }
        public TransactionType TransactionType { get; set; }
        public double Fee { get; set; }
        public string Note { get; set; }
        public double RealizedProfit { get; set; }
        public bool isActive { get; set; }
    }

    public class TransactionUpdateDto
    {
        public int StockId { get; set; } 
        public double Price { get; set; } 
        public DateTime Date { get; set; }
        public double Quantity { get; set; }
        public TransactionType TransactionType { get; set; }
        public double? Fee { get; set; } //Ha null, akkor 0
        public string? Note { get; set; } //Ha null, akkor üres string
    }
}
