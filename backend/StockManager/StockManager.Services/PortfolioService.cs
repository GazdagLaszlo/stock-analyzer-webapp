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
    public interface IPortfolioService
    {
        Task<int> CreateAsync(PortfolioCreateDto portfolioCreateDto, int userId);
        Task<IList<PortfolioDto>> GetAllAsync(int userId);
        Task<PortfolioDto> GetByIdAsync(int id);
        Task<PortfolioDto> UpdateAsync(int id, PortfolioUpdateDto updateDto);
        Task DeleteAsync(int id);
    }
    public class PortfolioService(AppDbContext context, IMapper mapper) : IPortfolioService
    {
        public async Task<int> CreateAsync(PortfolioCreateDto portfolioCreateDto, int userId)
        {
            var portfolio = mapper.Map<Portfolio>(portfolioCreateDto);
            portfolio.UserId = userId;

            await context.AddAsync(portfolio);
            await context.SaveChangesAsync();

            return portfolio.Id;
        }        
        public async Task<IList<PortfolioDto>> GetAllAsync(int userId)
        {
            var portfolios = await context.Portfolios
                .Include(x => x.PortfolioItems.Where(x => x.IsActive == true))
                    .ThenInclude(x => x.Stock)
                .Include(x => x.PortfolioItems)
                    .ThenInclude(x => x.Transactions)
                .Where(x => x.UserId == userId)
                .ToListAsync();

            return mapper.Map<IList<PortfolioDto>>(portfolios);
        }

        public async Task<PortfolioDto> GetByIdAsync(int id)
        {
            var portfolio = await context.Portfolios
                .Include(x => x.PortfolioItems)
                .FirstOrDefaultAsync(x => x.Id == id);

            if(portfolio == null)
            {
                throw new KeyNotFoundException($"Portfolio with id - {id} not found!");
            }

            return mapper.Map<PortfolioDto>(portfolio);
        }        
        public async Task<PortfolioDto> UpdateAsync(int id, PortfolioUpdateDto updateDto)
        {
            var portfolio = await context.Portfolios
                .FirstOrDefaultAsync(x => x.Id == id);

            if (portfolio == null)
            {
                throw new KeyNotFoundException($"Portfolio with id - {id} not found!");
            }

            mapper.Map(updateDto, portfolio);

            await context.SaveChangesAsync();

            return mapper.Map<PortfolioDto>(updateDto);
        }        
        public async Task DeleteAsync(int id)
        {
            var portfolio = await context.Portfolios
                .FirstOrDefaultAsync(x => x.Id == id);

            if (portfolio == null)
            {
                throw new KeyNotFoundException($"Portfolio with id - {id} not found!");
            }

            context.Portfolios.Remove(portfolio);
            await context.SaveChangesAsync();
        }
    }
}
