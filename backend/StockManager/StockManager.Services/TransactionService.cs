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
    public interface ITransactionService
    {
        Task CreateAsync(TransactionCreateDto transactionCreateDto, int userId);
        Task<IList<TransactionDto>> GetAllAsync(int userId);
        Task<TransactionDto> GetByIdAsync(int id);
        Task<TransactionDto> UpdateAsync(int id, TransactionUpdateDto updateDto);
        Task DeleteAsync(int id);
    }

    public class TransactionService(AppDbContext context, IMapper mapper) : ITransactionService
    {
        public async Task CreateAsync(TransactionCreateDto transactionCreateDto, int userId)
        {
            var stock = await context.Stocks
                .FirstOrDefaultAsync(x => x.Id == transactionCreateDto.StockId);

            if(stock == null)
            {
                throw new KeyNotFoundException($"Stock with id - {transactionCreateDto.StockId} not found!");
            }


            //A tranzakciónak kell, hogy portfolioItem-hez tartozzon fixen,
            //mert ez alapján dönthető el, hogy melyik portfolio-ban van benne.

            //Lehet több tranzakció ugyanarra a részvényre, de más portfoliokban.
            //Ezeket külön kell kezelnünk.

            var portfolio = await context.Portfolios
                .Include(x => x.PortfolioItems)
                    .ThenInclude(x => x.Transactions)
                .FirstOrDefaultAsync(x => x.Id == transactionCreateDto.PortfolioId && x.UserId == userId);

            if(portfolio == null)
            {
                throw new KeyNotFoundException($"Portfolio not found!");
            }

            var portfolioItem = portfolio.PortfolioItems
                .FirstOrDefault(x => x.StockId == transactionCreateDto.StockId);

            if (portfolioItem != null)
            {
                //Létezik ilyen stock a portfolio-ban, nem kell újat létrehozni

                if(transactionCreateDto.TransactionType == TransactionType.Buy)
                {
                    portfolioItem.AveragePurchasePrice =
                        (portfolioItem.AveragePurchasePrice * portfolioItem.Quantity + 
                        transactionCreateDto.Price * transactionCreateDto.Quantity) / (portfolioItem.Quantity + transactionCreateDto.Quantity);

                    portfolioItem.Quantity += transactionCreateDto.Quantity;
                }
                else if (transactionCreateDto.TransactionType == TransactionType.Sell)
                {
                    if(portfolioItem.Quantity < transactionCreateDto.Quantity)
                    {
                        throw new InvalidOperationException("Not enough stock quantity to sell!");
                    }
                    portfolioItem.Quantity -= transactionCreateDto.Quantity;
                }
            }
            else
            {
                //Nem létezik, létrehozunk új PortfolioItem-et
                portfolioItem = new PortfolioItem
                {
                    PortfolioId = transactionCreateDto.PortfolioId,
                    StockId = transactionCreateDto.StockId,
                    Quantity = transactionCreateDto.Quantity,
                    AveragePurchasePrice = transactionCreateDto.Price,
                };

                await context.PortfolioItems.AddAsync(portfolioItem);
            }

            var transaction = mapper.Map<Transaction>(transactionCreateDto);
            transaction.UserId = userId;
            transaction.PortfolioItem = portfolioItem;

            await context.AddAsync(transaction);
            await context.SaveChangesAsync();
        }
        public async Task<IList<TransactionDto>> GetAllAsync(int userId)
        {
            var transactions = await context.Transactions
                .Include(x => x.Stock)
                .Where(x => x.UserId == userId)
                .ToListAsync();

            return mapper.Map<IList<TransactionDto>>(transactions);
        }

        public async Task<TransactionDto> GetByIdAsync(int id)
        {
            var transaction = await context.Transactions
                .Include(x => x.Stock)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (transaction == null)
            {
                throw new KeyNotFoundException($"Transaction with id - {id} not found!");
            }

            return mapper.Map<TransactionDto>(transaction);
        }

        public async Task<TransactionDto> UpdateAsync(int id, TransactionUpdateDto updateDto)
        {
            var transaction = await context.Transactions
                .FirstOrDefaultAsync(x => x.Id == id);

            if (transaction == null)
            {
                throw new KeyNotFoundException($"Transaction with id - {id} not found!");
            }

            mapper.Map(updateDto, transaction);
            await context.SaveChangesAsync();

            return mapper.Map<TransactionDto>(transaction);
        }
        public async Task DeleteAsync(int id)
        {
            var transaction = await context.Transactions
                .FirstOrDefaultAsync(x => x.Id == id);

            if (transaction == null)
            {
                throw new KeyNotFoundException($"Transaction with id - {id} not found!");
            }

            context.Transactions.Remove(transaction);
            await context.SaveChangesAsync();
        }
    }
}
