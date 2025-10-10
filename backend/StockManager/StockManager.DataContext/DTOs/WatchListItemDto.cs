using StockManager.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.DataContext.DTOs
{
    public class WatchListItemDto
    {
        public int Id { get; set; }
        public StockDto Stock { get; set; }
        public int WatchListId { get; set; }
        public double? EntryPrice { get; set; }
        public string? Note { get; set; }
    }

    public class WatchListItemCreateDto
    {
        public int StockId { get; set; }
    }

    public class WatchListItemUpdateDto
    {
        public double? EntryPrice { get; set; }
        public string? Note { get; set; }
    }
}
