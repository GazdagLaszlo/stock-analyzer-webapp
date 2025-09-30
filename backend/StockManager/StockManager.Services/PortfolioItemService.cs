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
    public interface IPortfolioItemService
    {
        Task CreateAsync(PortfolioItemCreateDto portfolioItemCreateDto);
        Task<IList<PortfolioItemDto>> GetAllAsync(int portfolioId);
        Task<PortfolioItemDto> GetByIdAsync(int portfolioItemid);
        Task<PortfolioItemDto> UpdateAsync(int id, PortfolioItemUpdateDto updateDto);
        Task DeleteAsync(int portfolioItemId);
        Task<double> GetPortfolioItemProfitAsync(int portfolioItemId);
    }
    public class PortfolioItemService(AppDbContext context, IMapper mapper) : IPortfolioItemService
    {
        public async Task CreateAsync(PortfolioItemCreateDto portfolioItemCreateDto)
        {
            var stock = await context.Stocks
                .FirstOrDefaultAsync(x => x.Id == portfolioItemCreateDto.StockId);
            if (stock == null)
            {
                throw new KeyNotFoundException($"Stock with id - {portfolioItemCreateDto.StockId} not found!");
            }

            var portfolio = await context.Portfolios
                .FirstOrDefaultAsync(x => x.Id == portfolioItemCreateDto.PortfolioId);
            if (portfolio == null)
            {
                throw new KeyNotFoundException($"Portfolio with id - {portfolioItemCreateDto.PortfolioId} not found!");
            }

            var portfolioItem = mapper.Map<PortfolioItem>(portfolioItemCreateDto);

            await context.PortfolioItems.AddAsync(portfolioItem);
            await context.SaveChangesAsync();
        }
        public async Task<IList<PortfolioItemDto>> GetAllAsync(int portfolioId)
        {
            var portfolio = await context.Portfolios
                .FirstOrDefaultAsync(x => x.Id == portfolioId);
            if(portfolio == null)
            {
                throw new KeyNotFoundException($"Portfolio with id - {portfolioId} not found!");
            }

            var portfolioItems = await context.PortfolioItems
                .Include(x => x.Stock)
                .Where(x => x.PortfolioId == portfolioId)
                .ToListAsync();


            return mapper.Map<IList<PortfolioItemDto>>(portfolioItems);
        }
        public async Task<PortfolioItemDto> GetByIdAsync(int portfolioItemId)
        {
            var portfolioItem = await context.PortfolioItems
                .Include (x => x.Stock)
                .FirstOrDefaultAsync(x => x.Id == portfolioItemId);
            if(portfolioItem == null)
            {
                throw new KeyNotFoundException($"PortfolioItem with id - {portfolioItemId} not found!");
            }

            return mapper.Map<PortfolioItemDto>(portfolioItem);
        }
        public async Task<PortfolioItemDto> UpdateAsync(int id, PortfolioItemUpdateDto updateDto)
        {
            var portfolioItem = await context.PortfolioItems
                .FirstOrDefaultAsync (x => x.Id == id);
            if (portfolioItem == null)
            {
                throw new KeyNotFoundException($"PortfolioItem with id - {id} not found!");
            }

            var stock = await context.Stocks
                .FirstOrDefaultAsync(x => x.Id == updateDto.StockId);
            if (stock == null)
            {
                throw new KeyNotFoundException($"Stock with id - {stock.Id} not found!");
            }

            mapper.Map(updateDto, portfolioItem);
            await context.SaveChangesAsync();

            return mapper.Map<PortfolioItemDto>(portfolioItem);
        }
        public async Task DeleteAsync(int portfolioItemId)
        {
            var portfolioItem = await context.PortfolioItems
                .Include(x => x.Stock)
                .FirstOrDefaultAsync(x => x.Id == portfolioItemId);
            if (portfolioItem == null)
            {
                throw new KeyNotFoundException($"PortfolioItem with id - {portfolioItemId} not found!");
            }

            context.PortfolioItems.Remove(portfolioItem);
            await context.SaveChangesAsync();
        }
        
        public async Task<double> GetPortfolioItemProfitAsync(int portfolioItemId)
        {
            var portfolioItem = await context.PortfolioItems
                .Include(x => x.Stock)
                .Include(x => x.Transactions)
                .FirstOrDefaultAsync(x => x.Id == portfolioItemId);
            if (portfolioItem == null)
            {
                throw new KeyNotFoundException($"PortfolioItem with id - {portfolioItemId} not found!");
            }

            if(!portfolioItem.Transactions.Any())
            {
                return 0;
            }

            double sumValue = 0;
            double sumQuantity = 0;

            foreach ( var transaction in portfolioItem.Transactions.OrderBy(x => x.Date))
            {
                if(transaction.TransactionType == TransactionType.Buy)
                {
                    sumValue += transaction.Price * transaction.Quantity;
                    sumQuantity += transaction.Quantity;
                }
                else if(transaction.TransactionType == TransactionType.Sell)
                {
                    //Átlagos vételi árhoz viszonyítjuk az eladást, nem a jelenlegi eladási árhoz
                    double averagePrice = sumValue / sumQuantity;
                    sumValue -= averagePrice * transaction.Quantity;
                    sumQuantity -= transaction.Quantity;
                }
            }

            double averageBuyPrice = sumQuantity == 0 ? 0 : sumValue / sumQuantity;
            double currentValue = portfolioItem.Stock.Price * portfolioItem.Quantity;

            double profit = currentValue - averageBuyPrice * portfolioItem.Quantity;

            return profit;
        }
    }
}
