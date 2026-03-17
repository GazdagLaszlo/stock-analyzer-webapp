using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.DataContext.Entities
{
    public class Article
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Topic { get; set; }
        public string Content { get; set; }
    }
}
