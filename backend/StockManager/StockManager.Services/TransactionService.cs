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
        Task<IList<TransactionDto>> GetAllAsync(int userId, TransactionType? type, string portfolioId);
        Task<TransactionDto> GetByIdAsync(int id);
        Task<TransactionDto> UpdateAsync(int id, TransactionUpdateDto updateDto);
        Task DeleteAsync(int id);
        Task<TradeSummaryDto> GetTransactionsSummary(int userid);
        Task<IList<TransactionDto>> GetWithSameTradeId(Guid tradeId);
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
            Guid tradeId = Guid.Empty;

            if (portfolioItem != null)
            {
                //Létezik ilyen stock a portfolio-ban, nem kell újat létrehozni

                if(transactionCreateDto.TransactionType == TransactionType.Buy)
                {
                    if (portfolioItem.Quantity == 0)
                    {
                        tradeId = Guid.NewGuid();
                    }
                    else
                    {
                        tradeId = portfolioItem.Transactions
                            .Where(x => x.TransactionType == TransactionType.Buy)
                            .OrderByDescending(x => x.Id)
                            .First()
                            .TradeId;
                    }
                    portfolioItem.IsActive = true;

                    portfolioItem.AveragePurchasePrice =
                        (portfolioItem.AveragePurchasePrice * portfolioItem.Quantity + 
                        (transactionCreateDto.Price * transactionCreateDto.Quantity + (transactionCreateDto.Fee ?? 0))) / (portfolioItem.Quantity + transactionCreateDto.Quantity);

                    portfolioItem.Quantity += transactionCreateDto.Quantity;                    
                }
                else if (transactionCreateDto.TransactionType == TransactionType.Sell)
                {
                    tradeId = portfolioItem.Transactions
                          .Where(x => x.TransactionType == TransactionType.Buy)
                          .OrderByDescending(x => x.Id)
                          .First()
                          .TradeId;

                    portfolioItem.IsActive = true;

                    if(portfolioItem.Quantity < transactionCreateDto.Quantity)
                    {
                        throw new InvalidOperationException("Not enough stock quantity to sell!");
                    }
                    realizedProfit = (transactionCreateDto.Price - portfolioItem.AveragePurchasePrice) * transactionCreateDto.Quantity - (transactionCreateDto.Fee ?? 0);
                    portfolioItem.Quantity -= transactionCreateDto.Quantity;
                }
            }
            else
            {
                //Nem létezik, létrehozunk új PortfolioItem-et
                tradeId = Guid.NewGuid();
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
            transaction.TradeId = tradeId;

            if (portfolioItem.Quantity == 0)
            {
                portfolioItem.AveragePurchasePrice = 0;
                portfolioItem.IsActive = false;
                portfolioItem.Transactions.ForEach(x => x.IsActive = false);
                transaction.IsActive = false;
            }

            await context.AddAsync(transaction);
            await context.SaveChangesAsync();
        }
        public async Task<IList<TransactionDto>> GetAllAsync(int userId, TransactionType? type, string portfolioId)
        {
            var query = context.Transactions
                .Include(x => x.Stock)
                .Include(x => x.PortfolioItem)
                    .ThenInclude(x => x.Portfolio)
                .AsQueryable();

            query = query.Where(x => x.UserId == userId && (type == null || x.TransactionType == type));

            if (!string.IsNullOrWhiteSpace(portfolioId))
            {
                query = query.Where(x => x.PortfolioItem != null && x.PortfolioItem.Portfolio.Id == int.Parse(portfolioId));
            }

            var transactions = await query
                .IgnoreQueryFilters()
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
               .GroupBy(x => x.TradeId)
               .Where(x => x.All(x => !x.IsActive))
               .Select(x => new ClosedTradeDto
               {
                   TradeId = x.Key,
                   RealizedProfit = x.Where(x => x.TransactionType == TransactionType.Sell)
                        .Sum(x => x.RealizedProfit),
                   Transactions = mapper.Map<IList<TransactionDto>>(x.ToList()),
                   StartDate = x.Min(x => x.Date),
                   EndDate = x.Max(x => x.Date),
                   StockName = x.First().Stock.CompanyName,
                   StockSymbol = x.First().Stock.Symbol,
                   TotalQuantity = x.Where(t => t.TransactionType == TransactionType.Sell)
                     .Sum(t => t.Quantity),
               })
               .ToList();

            if (!closedTrades.Any())
            {
                return new TradeSummaryDto();
            }            

            var wins = closedTrades.Where(x => x.RealizedProfit > 0).ToList();
            var losses = closedTrades.Where(x => x.RealizedProfit < 0).ToList();

            int? profitableCount = wins.Any() ? wins.Count : null;
            int? losingCount = losses.Any() ? losses.Count : null;

            double? avgGain = wins.Count() != 0 ? wins.Average(x => x.RealizedProfit) : null;
            double? avgLoss = losses.Count() != 0 ? Math.Abs(losses.Average(x => x.RealizedProfit)) : null;

            double? averageRRR = avgLoss != 0 ? avgGain / avgLoss : 0;

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
                TotalProfitLoss = closedTrades.Count() != 0 ? closedTrades.Sum(x => x.RealizedProfit) : null,
                TotalClosedTrades = closedTrades.Count() != 0 ? closedTrades.Count() : null,
                ProfitableTradesCount = profitableCount,
                LosingTradesCount = losingCount,
                WinRate = closedTrades.Any() ? (double)wins.Count() / closedTrades.Count() * 100 : null,
                AverageGain = avgGain,
                AverageLoss = avgLoss,
                AverageRRR = averageRRR,
                ProfitFactor = totalLosses != 0 ? totalWins / totalLosses : null,
                ClosedTrades = closedTrades != null ? closedTrades : null,
                BestTrade = closedTrades != null ? bestTrade : null,
                WorstTrade = worstTrade != null ? worstTrade : null,
                TotalVolume = allTransactions.Count() != 0 ? allTransactions.Sum(x => x.Price+(x.Fee ?? 0)) : null,
            };
        }

        public async Task<IList<TransactionDto>> GetWithSameTradeId(Guid tradeId)
        {            
            var transactions = await context.Transactions.Include(x => x.Stock).Where(x => x.TradeId == tradeId).ToListAsync();

            if(transactions == null)
            {
                throw new KeyNotFoundException($"No transactions found with tradeId - {tradeId}!");
            }

            return mapper.Map<IList<TransactionDto>>(transactions);
        }
    }
}
