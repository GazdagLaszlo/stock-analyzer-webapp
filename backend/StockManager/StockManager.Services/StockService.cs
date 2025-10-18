using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using StockManager.DataContext.Context;
using StockManager.DataContext.DTOs;
using StockManager.DataContext.Entities;
using System.Net.Http;
using System.Text.Json;

namespace StockManager.Services
{
    public interface IStockService
    {
        Task<StockDto> CreateAsync(StockCreateDto stockCreateDto);
        Task<IList<StockDto>> GetAllAsync();
        Task<StockDto> GetBySymbolAsync(string symbol);
        Task<StockDto> UpdateAsync(int id, StockUpdateDto updateDto);
        Task<StockQuote> GetStockQuote(string symbol);
    }
    public class StockService : IStockService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly string _finnhubApiKey;
        private readonly HttpClient _httpClient;

        public StockService(AppDbContext context, IMapper mapper, IConfiguration configuration, HttpClient httpClient)
        {
            _context = context;
            _mapper = mapper;
            _finnhubApiKey = configuration["FinnhubApiKey:ApiKey"];
            _httpClient = httpClient;
        }
        public async Task<StockDto> CreateAsync(StockCreateDto stockCreateDto)
        {
            var stock = _mapper.Map<Stock>(stockCreateDto);

            await _context.Stocks.AddAsync(stock);
            await _context.SaveChangesAsync();

            return _mapper.Map<StockDto>(stock);
        }

        public async Task<IList<StockDto>> GetAllAsync()
        {
            var stocks = await _context.Stocks.ToListAsync();

            return _mapper.Map<IList<StockDto>>(stocks);
        }

        public async Task<StockDto> GetBySymbolAsync(string symbol)
        {
            var stock = await _context.Stocks
                .Where(x => x.Symbol == symbol)
                .FirstOrDefaultAsync();
            if(stock == null)
            {
                throw new KeyNotFoundException($"Stock not found with symbol: {symbol}");
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

        public async Task<StockQuote> GetStockQuote(string symbol)
        {
            var getData = $"https://finnhub.io/api/v1/quote?symbol={symbol}&token={_finnhubApiKey}";
            var response = await _httpClient.GetAsync(getData);
            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Error: {response.StatusCode}");
            }
            var responseString = await response.Content.ReadAsStringAsync();

            var quote = JsonSerializer.Deserialize<StockQuote>(responseString);

            return quote;
        }
    }
}
