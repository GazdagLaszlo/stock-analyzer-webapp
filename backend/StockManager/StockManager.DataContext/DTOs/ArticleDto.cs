using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.DataContext.DTOs
{
    public class ArticleDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Topic { get; set; }
        public string Content { get; set; }
    }

    public class ArticleCreateUpdateDto
    {
        public string Title { get; set; }
        public string Topic { get; set; }
        public string Content { get; set; }
    }
}
