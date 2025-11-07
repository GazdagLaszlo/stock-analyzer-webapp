using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using StockManager.DataContext.Context;
using StockManager.DataContext.DTOs;
using StockManager.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace StockManager.Services
{
    public interface IStockDataService
    {
        Task CreateAsync(StockDataCreateDto stockDataCreateDto);
        Task<StockDataDto> GetBySymbolAsync(string symbol);
        Task<StockDataDto> UpdateAsync(int id, StockDataUpdateDto updateDto);
        Task<StockDataCreateDto> GetStockFinancials(string symbol);
        Task StockDataRefresh(StockDto stock);
    }
    public class StockDataService : IStockDataService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly string _finnhubApiKey;
        private readonly HttpClient _httpClient;
        public StockDataService(AppDbContext context, IMapper mapper, IConfiguration configuration, HttpClient httpClient)
        {
            _context = context;
            _mapper = mapper;
            _finnhubApiKey = configuration["FinnhubApiKey:ApiKey"];
            _httpClient = httpClient;
        }

        public async Task CreateAsync(StockDataCreateDto stockDataCreateDto)
        {
            var stockData = _mapper.Map<StockData>(stockDataCreateDto);

            var stock = await _context.Stocks
                .FirstOrDefaultAsync(x => x.Id == stockDataCreateDto.StockId);

            if (stock == null)
            {
                throw new KeyNotFoundException($"Stock with id - {stockDataCreateDto.StockId} not found!");
            }

            await _context.AddAsync(stockData);
            await _context.SaveChangesAsync();
        }

        public async Task<StockDataDto> GetBySymbolAsync(string symbol)
        {
            var stockData = await _context.StockData
                .Include(x => x.Stock)
                .FirstOrDefaultAsync(x => x.Stock.Symbol == symbol);
            Console.WriteLine(stockData.PSTTM);

            if (stockData == null)
            {
                throw new KeyNotFoundException($"StockData with stock symbol - {symbol} not found!");
            }

            return _mapper.Map<StockDataDto>(stockData);
        }

        public async Task<StockDataDto> UpdateAsync(int id, StockDataUpdateDto updateDto)
        {
            var stockData = await _context.StockData
                .FirstOrDefaultAsync(x => x.Id == id);

            if (stockData == null)
            {
                throw new KeyNotFoundException($"StockData with id - {id} not found!");
            }

            _mapper.Map(updateDto, stockData);
            await _context.SaveChangesAsync();

            return _mapper.Map<StockDataDto>(stockData);
        }

        public async Task<StockDataCreateDto> GetStockFinancials(string symbol)
        {
            var getData = $"https://finnhub.io/api/v1/stock/metric?symbol={symbol}&metric=all&token={_finnhubApiKey}";
            //StockDataDeserializer data = null;

            while (true)
            {
                var response = await _httpClient.GetAsync(getData);                                

                if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
                {
                    Console.WriteLine("Too many requests. API limit reached.");
                    await Task.Delay(10000);
                    continue;
                }

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Error: {response.StatusCode}");
                    return null;
                }

                var responseString = await response.Content.ReadAsStringAsync();                

                try
                {
                    var data = JsonSerializer.Deserialize<StockDataDeserializer>(responseString);
                    return data?.metric;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");                    
                    return null;
                }
            }
        }

        public Task<bool> CheckExistance(string symbol)
        {
            return _context.StockData.AnyAsync(x => x.Stock.Symbol == symbol);
        }

        public async Task StockDataRefresh(StockDto stockDto)
        {
            var createDto = await GetStockFinancials(stockDto.Symbol);
            createDto.StockId = stockDto.Id;
            createDto.UpdatedDate = DateOnly.FromDateTime(DateTime.Now);

            var exists = await CheckExistance(stockDto.Symbol);

            if (!exists)
            {
                await CreateAsync(createDto);
            }
            else
            {
                var stockData = await _context.StockData.FirstOrDefaultAsync(x => x.Stock.Id == stockDto.Id);

                var dto = _mapper.Map<StockDataUpdateDto>(createDto);
                await UpdateAsync(stockData.Id, dto);
            }

        }
    }
}
