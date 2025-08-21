using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using StockManager.DataContext.DTOs;
using StockManager.Services;

namespace StockManager.Services
{
    public class Metric
    {
        public double marketCapitalization { get; set; }   
    }
    public class MetricResponse
    {
        public Metric metric { get; set; }
    }
    public class StockUpdaterService
    {
        private readonly HttpClient _httpClient;
        private readonly IStockService _stockService;

        public StockUpdaterService(HttpClient httpClient, IStockService stockService)
        {
            _httpClient = httpClient;
            _stockService = stockService;
        }

        public async Task GetSP500Stocks()
        {
            string ninjaApiKey = "3ILBgQDAH8BATGJp0aPiYA==0y3W4FYJYdhruc2g";
            _httpClient.DefaultRequestHeaders.Add("X-Api-Key", ninjaApiKey);
            var ninjaResponse = await _httpClient.GetStringAsync("https://api.api-ninjas.com/v1/sp500");
            
            string finnhubApiKey = "d2e57s1r01qjrul642d0d2e57s1r01qjrul642dg";

            /*
            var url = $"https://finnhub.io/api/v1/stock/symbol?exchange=US&token={apiKey}";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            var responseString = await response.Content.ReadAsStringAsync();
            var companys = JsonSerializer.Deserialize<List<StockCreateDto>>(responseString);
            */
            var companys = JsonSerializer.Deserialize<List<StockCreateDto>>(ninjaResponse);

            var allStocks = await _stockService.GetAllAsync();

            foreach (var company in companys)
            {
                var getStock = $"https://finnhub.io/api/v1/stock/metric?symbol={company.Symbol}&metric=all&token={finnhubApiKey}";
                var response = await _httpClient.GetAsync(getStock);
                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Nem sikerült lekérni {company.Symbol}, status: {response.StatusCode}");
                    continue;
                }
                var responseString = await response.Content.ReadAsStringAsync();

                var stock = JsonSerializer.Deserialize<MetricResponse>(responseString);

                if (!allStocks.Any(x => x.Symbol == company.Symbol))
                {

                    var dto = new StockCreateDto
                    {
                        Symbol = company.Symbol,
                        MarketCap = stock.metric.marketCapitalization,
                        CompanyName = company.CompanyName,
                        Sector = company.Sector,
                    };
                    await _stockService.CreateAsync(dto);
                }
                else
                {
                    var stockToUpdate = allStocks.FirstOrDefault(x => x.Symbol.Equals(company.Symbol));

                    var updateDto = new StockUpdateDto
                    {
                        Symbol = company.Symbol,
                        MarketCapitalization = stock.metric.marketCapitalization,
                        CompanyName = company.CompanyName,
                        Sector = company.Sector,
                    };

                    await _stockService.UpdateAsync(stockToUpdate.Id, updateDto);
                }

                //60 request/min is the max capacity on Finnhub.io
                await Task.Delay(1200);
            }
        }
    }
}
