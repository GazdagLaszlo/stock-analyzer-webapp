using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.DataContext.Entities
{
    public class StockReport
    {
        public int Id { get; set; }
        //Az api-tól Symbol jön
        public int StockId { get; set; }
        public Stock Stock { get; set; }
        //Ezzel ellenőrizzük, hogy létezik-e már. Ha nem, api-ból mentjük
        public string AccessNumber { get; set; }
        public int Year { get; set; }
        public int Quarter { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime FiledDate { get; set; }
        public DateTime AcceptedDate { get; set; }

        public List<StockReportItem> StockReportItems { get; set; } = new List<StockReportItem>();
    }
}
