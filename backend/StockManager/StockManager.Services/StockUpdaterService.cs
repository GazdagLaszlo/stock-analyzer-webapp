using Microsoft.AspNetCore.Mvc;
using StockManager.DataContext.DTOs;
using StockManager.DataContext.Entities;
using StockManager.Services;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace StockManager.Services
{    
    public class StockUpdaterService
    {
        const string ninjaApiKey = "";
        const string finnhubApiKey = "";

        private readonly HttpClient _httpClient;
        private readonly IStockService _stockService;        

        public StockUpdaterService(HttpClient httpClient, IStockService stockService)
        {
            _httpClient = httpClient;
            _stockService = stockService;

            _httpClient.DefaultRequestHeaders.Add("X-Api-Key", ninjaApiKey);
        }

        public async Task GetStocks()
        {
            var companies = await GetSP500Companies();

            foreach (var company in companies)
            {
                var data = await GetCompanyData(company.Symbol);
                var price = await GetStockPriceAsync(company.Symbol);                
                var allStocks = await _stockService.GetAllAsync();

                await SaveStock(data, price, allStocks);

                await Task.Delay(1200);
            }
        }
        public async Task<List<StockCreateDto>> GetSP500Companies()
        {            
            var ninjaResponse = await _httpClient.GetStringAsync("https://api.api-ninjas.com/v1/sp500");
            return JsonSerializer.Deserialize<List<StockCreateDto>>(ninjaResponse);
        }        
        public async Task<StockCreateDto> GetCompanyData(string symbol)
        {
            var getData = $"https://finnhub.io/api/v1/stock/profile2?symbol={symbol}&token={finnhubApiKey}";
            var response = await _httpClient.GetAsync(getData);
            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Nem sikerült lekérni {symbol}, status: {response.StatusCode}");
                return null;
            }
            var responseString = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<StockCreateDto>(responseString);
        }        
        /*
        private async Task<double?> GetMarketCapAsync(string symbol)
        {
            var getStock = $"https://finnhub.io/api/v1/stock/metric?symbol={symbol}&metric=all&token={finnhubApiKey}";
            var response = await _httpClient.GetAsync(getStock);
            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Nem sikerült lekérni {symbol}, status: {response.StatusCode}");
                return null;
            }
            var responseString = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(responseString);
            var metric = doc.RootElement.GetProperty("metric");
            var marketCap = metric.GetProperty("marketCapitalization").GetDouble();

            return marketCap;
        }
        */
        private async Task SaveStock(StockCreateDto data, double price, IList<StockDto> allStocks)
        {
            var stockExists = allStocks.FirstOrDefault(x => x.Symbol == data.Symbol);
            
            if(stockExists == null)
            {                
                var dto = new StockCreateDto
                {
                    Symbol = data.Symbol,
                    MarketCap = data.MarketCap,
                    CompanyName = data.CompanyName,
                    Sector = data.Sector,
                    Price = price,
                    Exchange = data.Exchange,
                    ShareOutstanding = data.ShareOutstanding,
                };
                await _stockService.CreateAsync(dto);
            }
            else
            {
                var updateDto = new StockUpdateDto
                {                    
                    Symbol = data.Symbol,
                    MarketCapitalization = data.MarketCap,
                    CompanyName = data.CompanyName,
                    Sector = data.Sector,
                    Price = price,
                    Exchange = data.Exchange,
                    ShareOutstanding = data.ShareOutstanding,
                };

                await _stockService.UpdateAsync(stockExists.Id, updateDto);
            }
        }
        public async Task<bool> CheckMarketStatus()
        {
            var getStatus = $"https://finnhub.io/api/v1/stock/market-status?exchange=US&token={finnhubApiKey}";
            var response = await _httpClient.GetAsync(getStatus);
            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Nem sikerült lekérni a piac státuszát: {response.StatusCode}");
            }
            var responseString = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(responseString);
            var isOpen = doc.RootElement.GetProperty("isOpen").GetBoolean();

            return isOpen;
        }

        public async Task<double> GetStockPriceAsync(string symbol)
        {
            var getPrice = $"https://finnhub.io/api/v1/quote?symbol={symbol}&token={finnhubApiKey}";
            var response = await _httpClient.GetAsync(getPrice);
            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Nem sikerült lekérni az árfolyamot: {response.StatusCode}");
            }
            var responseString = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(responseString);
            var price = doc.RootElement.GetProperty("c").GetDouble();

            return price;
        }
    }
}