using StockManager.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.DataContext.DTOs
{
    public class StockReportDto
    {
        public int Id { get; set; }
        public StockDto Stock { get; set; }
        public string AccessNumber { get; set; }
        public int Year { get; set; }
        public int Quarter { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime FiledDate { get; set; }
        public DateTime AcceptedDate { get; set; }

        public List<StockReportItemDto> StockReportItems { get; set; } = new List<StockReportItemDto>();
    }
}
