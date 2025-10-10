using AutoMapper;
using Microsoft.EntityFrameworkCore;
using StockManager.DataContext.Context;
using StockManager.DataContext.DTOs;
using StockManager.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Services
{
    public interface IWatchListItemService
    {
        Task CreateAsync(WatchListItemCreateDto watchListItemCreateDto, int userId);
        Task<WatchListItemDto> GetByIdAsync(int id);
        Task<WatchListItemDto> UpdateAsync(int id, WatchListItemUpdateDto updateDto);
        Task DeleteAsync(int id);
    }
    public class WatchListItemService(AppDbContext context, IMapper mapper) : IWatchListItemService
    {
        public async Task CreateAsync(WatchListItemCreateDto watchListItemCreateDto, int userId)
        {
            if (watchListItemCreateDto.StockId == null)
            {
                throw new KeyNotFoundException($"Stock with id - {watchListItemCreateDto.StockId} not found!");
            }

            var watchlist = await context.WatchLists
                .FirstOrDefaultAsync(x => x.UserId == userId);

            var watchlistItem = mapper.Map<WatchListItem>(watchListItemCreateDto);
            watchlistItem.WatchListId = watchlist.Id;

            await context.AddAsync(watchlistItem);
            await context.SaveChangesAsync();
        }        
        public async Task<WatchListItemDto> GetByIdAsync(int id)
        {
            var watchListItem = await context.WatchListItems
                .Include (x => x.Stock)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (watchListItem == null)
            {
                throw new KeyNotFoundException($"WatchListItem with id - {id} not found!");
            }

            return mapper.Map<WatchListItemDto>(watchListItem);
        }

        public async Task<WatchListItemDto> UpdateAsync(int id, WatchListItemUpdateDto updateDto)
        {     
            /*
            if (updateDto.WatchListId == null)
            {
                throw new KeyNotFoundException($"Watchlist with id - {updateDto.WatchListId} not found!");
            }

            if (updateDto.StockId == null)
            {
                throw new KeyNotFoundException($"Stock with id - {updateDto.StockId} not found!");
            }
            */

            var watchListItem = await context.WatchListItems
                .FirstOrDefaultAsync(x => x.Id == id);

            if (watchListItem == null)
            {
                throw new KeyNotFoundException($"WatchListItem with id - {id} not found!");
            }

            mapper.Map(updateDto, watchListItem);
            await context.SaveChangesAsync();

            return mapper.Map<WatchListItemDto>(watchListItem);
        }
        public async Task DeleteAsync(int id)
        {
            var watchListItem = await context.WatchListItems
                .Include(x => x.Stock)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (watchListItem == null)
            {
                throw new KeyNotFoundException($"WatchListItem with id - {id} not found!");
            }

            context.WatchListItems.Remove(watchListItem);
            await context.SaveChangesAsync();
        }        
    }
}
