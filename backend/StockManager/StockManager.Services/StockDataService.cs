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
        Task<StockDataDeserializer> GetStockFinancials(string symbol);
        Task StockDataRefresh(StockDto stock);
        Task<Dictionary<string, decimal?>> GetBySymbolLatestDataASync(string symbol);
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

            if (stockData == null)
            {
                return null;
            }

            return _mapper.Map<StockDataDto>(stockData);
        }

        public async Task<Dictionary<string, decimal?>> GetBySymbolLatestDataASync(string symbol)
        {
            var allMetrics = new[]
            {
                "assetTurnoverTTM", "bookValue", "cashRatio", "currentRatio",
                "ebitPerShare", "eps", "ev", "evEbitdaTTM", "evRevenueTTM",
                "fcfMargin", "fcfPerShareTTM", "grossMargin", "inventoryTurnoverTTM",
                "longtermDebtTotalAsset", "longtermDebtTotalCapital","longtermDebtTotalEquity",
                "netDebtToTotalCapital", "netDebtToTotalEquity", "netMargin",
                "operatingMargin", "payoutRatioTTM","pb", "peTTM", "pfcfTTM", "pretaxMargin",
                "psTTM", "ptbv", "quickRatio", "receivablesTurnoverTTM", "roaTTM", "roeTTM", 
                "roicTTM", "rotcTTM", "salesPerShare", "sgaToSale","tangibleBookValue",
                "totalDebtToEquity", "totalDebtToTotalAsset", "totalDebtToTotalCapital",
                "totalRatio"
            };

            var data = await GetLatestValue(symbol);
            if (data == null)
            {
                return null;
            }

            var result = new Dictionary<string, decimal?>();

            foreach(var metric in allMetrics)
            {
                if(data.TryGetValue(metric, out var item))
                {
                    result[metric] = item.V;
                }
                else
                {
                    result[metric] = null;
                }
            }

            return result;
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

        public async Task<StockDataDeserializer> GetStockFinancials(string symbol)
        {
            var getData = $"https://finnhub.io/api/v1/stock/metric?symbol={symbol}&metric=all&token={_finnhubApiKey}";

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
                    return data;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");                    
                    return null;
                }
            }
        }

        public async Task<StockData> CheckExistance(string symbol)
        {
            var data = await _context.StockData
                .FirstOrDefaultAsync(x => x.Stock.Symbol == symbol);
            return data;
        }

        public async Task StockDataRefresh(StockDto stockDto)
        {
            var stockExists = await CheckExistance(stockDto.Symbol);

            if(stockExists != null && stockExists.UpdatedDate == DateOnly.FromDateTime(DateTime.Now))
            {                
                return;
            }

            var data = await GetStockFinancials(stockDto.Symbol);

            var dto = data.metric;
            dto.StockId = stockDto.Id;
            dto.UpdatedDate = DateOnly.FromDateTime(DateTime.Now);

            //dto.StockDataItems = new List<StockDataItemDto>();
            var newItems = new List<StockDataItemDto>();

            foreach (var annualItem in data.series.annual)
            {
                var metricName = annualItem.Key;

                foreach (var item in annualItem.Value)
                {
                    newItems.Add(new StockDataItemDto
                    {
                        Period = DateOnly.Parse(item.period),
                        PeriodType = PeriodType.Annual,
                        V = item.v,
                        MetricName = metricName,
                    });
                }
            }

            foreach (var quarterlyItem in data.series.quarterly)
            {
                var metricName = quarterlyItem.Key;

                foreach (var item in quarterlyItem.Value)
                {
                    newItems.Add(new StockDataItemDto
                    {
                        Period = DateOnly.Parse(item.period),
                        PeriodType = PeriodType.Quarterly,
                        V = item.v,
                        MetricName = metricName,
                    });
                }
            }            

            if (stockExists == null)
            {
                dto.StockDataItems = newItems;
                await CreateAsync(dto);
            }
            else
            {
                var existsData = await _context.StockData
                    .Include(x => x.StockDataItems)
                    .FirstOrDefaultAsync(x => x.Stock.Symbol == stockDto.Symbol);

                foreach (var item in newItems)
                {
                    bool exists = existsData.StockDataItems
                       .Any(e =>
                           e.MetricName == item.MetricName &&
                           e.PeriodType == item.PeriodType &&
                           e.Period == item.Period);                      

                    if (!exists)
                    {
                        var newItem = _mapper.Map<StockDataItem>(item);
                        newItem.StockDataId = stockExists.Id;
                        _context.StockDataItems.Add(newItem);
                    }
                }                

                await _context.SaveChangesAsync();
            }

            var mainData = data.metric;
            var updateDto = _mapper.Map<StockDataUpdateDto>(mainData);
            await UpdateAsync(stockExists.Id, updateDto);            
        }

        private async Task<Dictionary<string, StockDataItem>?> GetLatestValue(string symbol)
        {
            //Az adatokat mindig a legfrissebb meglévő adat alapján adja vissza. 
            //Ha van negyedéves (StockDataItem.PeriodType => 1) akkor azt, majd az éves adatot. 

            var dataItems = await _context.StockDataItems
                .Where(x => x.StockData.Stock.Symbol == symbol && x.PeriodType == PeriodType.Quarterly)
                .GroupBy(x => x.MetricName)
                .Select(x => x.OrderByDescending(x => x.Period).First())
                .ToListAsync();

            var resultDictionary = dataItems.ToDictionary(x => x.MetricName, x => x);

            if (dataItems != null)
            {
                return resultDictionary;
            }
            return null;
        }
    }
}
