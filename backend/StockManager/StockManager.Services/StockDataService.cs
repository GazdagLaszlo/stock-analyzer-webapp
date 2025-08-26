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
    public interface IStockDataService
    {
        Task CreateAsync(StockDataCreateDto stockDataCreateDto);        
        Task<StockDataDto> GetByIdAsync(int id);
        Task<StockDataDto> UpdateAsync(int id, StockDataUpdateDto updateDto);
    }
    public class StockDataService(AppDbContext context, IMapper mapper) : IStockDataService
    {
        public async Task CreateAsync(StockDataCreateDto stockDataCreateDto)
        {
            var stockData = mapper.Map<StockData>(stockDataCreateDto);

            var stock = await context.Stocks
                .FirstOrDefaultAsync(x => x.Id == stockDataCreateDto.StockId);

            if (stock == null)
            {
                throw new KeyNotFoundException($"Stock with id - {stockDataCreateDto.StockId} not found!");
            }

            await context.AddAsync(stock);
            await context.SaveChangesAsync();
        }

        public async Task<StockDataDto> GetByIdAsync(int id)
        {
            var stockData = await context.StockData
                .FirstOrDefaultAsync(x => x.Id == id);

            if (stockData == null)
            {
                throw new KeyNotFoundException($"StockData with id - {id} not found!");
            }

            return mapper.Map<StockDataDto>(stockData);
        }

        public async Task<StockDataDto> UpdateAsync(int id, StockDataUpdateDto updateDto)
        {
            var stockData = await context.StockData
                .FirstOrDefaultAsync(x => x.Id == id);

            if (stockData == null)
            {
                throw new KeyNotFoundException($"StockData with id - {id} not found!");
            }

            mapper.Map(updateDto, stockData);
            await context.SaveChangesAsync();

            return mapper.Map<StockDataDto>(stockData);
        }
    }
}
