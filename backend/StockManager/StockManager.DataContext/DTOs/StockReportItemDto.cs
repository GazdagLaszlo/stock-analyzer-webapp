using StockManager.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.DataContext.DTOs
{
    public class StockReportItemDto
    {
        public int Id { get; set; }        
        public string ReportSection { get; set; }
        public string Concept { get; set; }
        public string Unit { get; set; }
        public string Label { get; set; }
        public double Value { get; set; }
    }
}
