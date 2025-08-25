using StockManager.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.DataContext.DTOs
{
    public class WatchListDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public List<WatchListItemDto> WatchListItems { get; set; }
    }
}
