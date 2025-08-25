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
        Task<WatchListDto> GetByIdAsync(int watchListId);
    }
    public class WatchListService(AppDbContext context, IMapper mapper) : IWatchListService
    {              
        public async Task<WatchListDto> GetByIdAsync(int watchListId)
        {
            var watchlist = await context.WatchLists
                .Include(x => x.WatchListItems)
                .FirstOrDefaultAsync(x => x.Id == watchListId);

            if (watchlist == null)
            {
                throw new KeyNotFoundException($"Watchlist with id - {watchListId} not found!");
            }

            return mapper.Map<WatchListDto>(watchlist);            
        }                
    }
}
