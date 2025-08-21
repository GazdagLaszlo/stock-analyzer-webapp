using StockManager.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.DataContext.DTOs
{
    public class PortfolioCreateDto
    {
        public string Name { get; set; }
    }
    public class PortfolioDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<PortfolioItemDto> PortfolioItems { get; set; } = new List<PortfolioItemDto>();
        public decimal? Value { get; set; }
        public decimal? ProfitLoss { get; set; }
    }

    public class PortfolioUpdateDto
    {
        public string Name { get; set; }
    }
}
