using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.DataContext.Entities
{
    public class Earningscalendar
    {
        public string date { get; set; }
        public float? epsEstimate { get; set; }
        public int quarter { get; set; }
        public string symbol { get; set; }
        public int year { get; set; }
    }
}
