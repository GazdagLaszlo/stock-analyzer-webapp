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

            var transaction = mapper.Map<Transaction>(transactionCreateDto);
            transaction.UserId = userId;

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
