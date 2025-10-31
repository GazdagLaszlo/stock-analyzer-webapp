using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.DataContext.Entities
{
    public class StockReportItem
    {
        public int Id { get; set; }
        public int StockReportId { get; set; }
        public StockReport StockReport { get; set; }
        public string ReportSection { get; set; } //finnhub - bs, ic, cf
        public string Concept { get; set; }
        public string Unit { get; set; }
        public string Label { get; set; }
        public double Value { get; set; }
    }
}
