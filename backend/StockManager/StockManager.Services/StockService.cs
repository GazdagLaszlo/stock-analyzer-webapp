using AutoMapper;
using StockManager.DataContext.DTOs;
using StockManager.DataContext.Entities;
using StockManager.DataContext.Context;
using Microsoft.EntityFrameworkCore;

namespace StockManager.Services
{
    public interface IStockService
    {
        Task CreateAsync(StockCreateDto stockCreateDto);
        Task<IList<StockDto>> GetAllAsync();
        Task<StockDto> GetByIdAsync(int id);
        Task<StockDto> UpdateAsync(int id, StockUpdateDto updateDto);
    }
    public class StockService : IStockService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public StockService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task CreateAsync(StockCreateDto stockCreateDto)
        {
            var stock = _mapper.Map<Stock>(stockCreateDto);

            await _context.Stocks.AddAsync(stock);
            await _context.SaveChangesAsync();
        }

        public async Task<IList<StockDto>> GetAllAsync()
        {
            var stocks = await _context.Stocks.ToListAsync();

            return _mapper.Map<IList<StockDto>>(stocks);
        }

        public async Task<StockDto> GetByIdAsync(int id)
        {
            var stock = await _context.Stocks.FindAsync(id);
            if(stock == null)
            {
                throw new KeyNotFoundException($"Stock not found with id: {id}");
            }

            return _mapper.Map<StockDto>(stock);
        }
        public async Task<StockDto> UpdateAsync(int id, StockUpdateDto updateDto)
        {
            var stock = await _context.Stocks.FindAsync(id);
            if(stock == null)
            {
                throw new KeyNotFoundException($"Stock not found with id: {id}");
            }

            _mapper.Map(updateDto, stock);

            await _context.SaveChangesAsync();

            return _mapper.Map<StockDto>(stock);
        }
    }
}
