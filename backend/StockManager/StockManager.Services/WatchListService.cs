using AutoMapper;
using Microsoft.EntityFrameworkCore;
using StockManager.DataContext.Context;
using StockManager.DataContext.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Services
{
    public interface IWatchListService
    {
        Task<WatchListDto> GetByUserIdAsync(int userId);
    }
    public class WatchListService(AppDbContext context, IMapper mapper) : IWatchListService
    {              
        public async Task<WatchListDto> GetByUserIdAsync(int userId)
        {
            var watchlist = await context.WatchLists
                .Include(x => x.WatchListItems)
                    .ThenInclude(x => x.Stock)
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (watchlist == null)
            {
                throw new KeyNotFoundException($"Watchlist not found!");
            }

            return mapper.Map<WatchListDto>(watchlist);            
        }                
    }
}
