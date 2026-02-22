using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
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
        Task<IList<TransactionDto>> GetAllAsync(int userId, TransactionType? type);
        Task<TransactionDto> GetByIdAsync(int id);
        Task<TransactionDto> UpdateAsync(int id, TransactionUpdateDto updateDto);
        Task DeleteAsync(int id);
        Task<TradeSummaryDto> GetTransactionsSummary(int userid);
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
            double realizedProfit = 0;

            if (portfolioItem != null)
            {
                //Létezik ilyen stock a portfolio-ban, nem kell újat létrehozni

                if(transactionCreateDto.TransactionType == TransactionType.Buy)
                {
                    portfolioItem.IsActive = true;

                    portfolioItem.AveragePurchasePrice =
                        (portfolioItem.AveragePurchasePrice * portfolioItem.Quantity + 
                        transactionCreateDto.Price * transactionCreateDto.Quantity) / (portfolioItem.Quantity + transactionCreateDto.Quantity);

                    portfolioItem.Quantity += transactionCreateDto.Quantity;
                }
                else if (transactionCreateDto.TransactionType == TransactionType.Sell)
                {
                    portfolioItem.IsActive = true;

                    if(portfolioItem.Quantity < transactionCreateDto.Quantity)
                    {
                        throw new InvalidOperationException("Not enough stock quantity to sell!");
                    }
                    realizedProfit = (transactionCreateDto.Price - portfolioItem.AveragePurchasePrice) * transactionCreateDto.Quantity;
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
                    IsActive = true,
                };

                await context.PortfolioItems.AddAsync(portfolioItem);
            }

            var transaction = mapper.Map<Transaction>(transactionCreateDto);
            transaction.UserId = userId;
            transaction.PortfolioItem = portfolioItem;
            transaction.IsActive = true;
            transaction.RealizedProfit = realizedProfit;

            if (portfolioItem.Quantity == 0)
            {
                portfolioItem.IsActive = false;
                portfolioItem.Transactions.ForEach(x => x.IsActive = false);
                transaction.IsActive = false;
            }

            await context.AddAsync(transaction);
            await context.SaveChangesAsync();
        }
        public async Task<IList<TransactionDto>> GetAllAsync(int userId, TransactionType? type)
        {
            var transactions = await context.Transactions
                .IgnoreQueryFilters()
                .Include(x => x.Stock)
                .Where(x => x.UserId == userId && (type == null || x.TransactionType == type))
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
                .Include(x => x.PortfolioItem)
                    .ThenInclude(x => x.Transactions)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (transaction == null)
            {
                throw new KeyNotFoundException($"Transaction with id - {id} not found!");
            }

            var portfolioItem = transaction.PortfolioItem;

            if (transaction.TransactionType == TransactionType.Buy && portfolioItem.Quantity < transaction.Quantity)
            {
                throw new BadHttpRequestException(
                    "Cannot delete this the transaction because some of the shares have already been sold."
                );
            }

            if (transaction.TransactionType == TransactionType.Buy)
            {
                if (portfolioItem.Quantity - transaction.Quantity == 0)
                {
                    portfolioItem.AveragePurchasePrice = 0;
                    portfolioItem.IsActive = false;
                    portfolioItem.Transactions.ForEach(x => x.IsActive = false);
                }
                else
                {
                    portfolioItem.AveragePurchasePrice =
                        ((portfolioItem.AveragePurchasePrice * portfolioItem.Quantity) -
                        (transaction.Price * transaction.Quantity)) / (portfolioItem.Quantity - transaction.Quantity);
                }

                portfolioItem.Quantity -= transaction.Quantity;
            }
            else if (transaction.TransactionType == TransactionType.Sell)
            {
                portfolioItem.Quantity += transaction.Quantity;
                if (portfolioItem.Quantity > 0)
                {
                    portfolioItem.IsActive = true;
                }                    
            }

            context.Transactions.Remove(transaction);
            await context.SaveChangesAsync();
        }

        public async Task<TradeSummaryDto> GetTransactionsSummary(int userId)
        {
            var allTransactions = await context.Transactions
                .Include(x => x.Stock)
                .Where(x => x.UserId == userId)
                .ToListAsync();

            var closedTrades = allTransactions
                .Where(t => t.RealizedProfit != 0)
                .ToList();

            var wins = closedTrades.Where(x => x.RealizedProfit > 0);
            var losses = closedTrades.Where(x => x.RealizedProfit < 0);

            double avgGain = wins.Any() ? wins.Average(x => x.RealizedProfit) : 0;
            double avgLoss = losses.Any() ? Math.Abs(losses.Average(x => x.RealizedProfit)) : 0;

            //Risk to Reward ratio
            double averageRRR = avgLoss != 0 ? avgGain / avgLoss : 0;

            double totalWins = wins.Any() ? wins.Sum(x => x.RealizedProfit) : 0;
            double totalLosses = losses.Any() ? losses.Sum(x => Math.Abs(x.RealizedProfit)) : 0;

            var bestTrade = closedTrades.Any()
                ? closedTrades.OrderByDescending(t => t.RealizedProfit).First()
                : null;

            var worstTrade = closedTrades.Any()
                ? closedTrades.OrderBy(t => t.RealizedProfit).First()
                : null;

            return new TradeSummaryDto
            {
                TotalProfitLoss = closedTrades.Sum(x => x.RealizedProfit),
                TotalClosedTrades = closedTrades.Count(x => x.TransactionType == TransactionType.Sell),
                ProfitableTradesCount = wins.Count(),
                LosingTradesCount = losses.Count(),
                WinRate = closedTrades.Any() ? (double)wins.Count() / closedTrades.Count() * 100 : 0,
                AverageGain = avgGain,
                AverageLoss = avgLoss,
                AverageRRR = averageRRR,
                ProfitFactor = totalWins / totalLosses,
                BestTrade = bestTrade != null ? mapper.Map<TransactionDto>(bestTrade) : null,
                WorstTrade = worstTrade != null ? mapper.Map<TransactionDto>(worstTrade) : null,
            };
        }
    }
}
