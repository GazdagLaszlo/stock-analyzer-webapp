using Microsoft.Extensions.Configuration;
using StockManager.DataContext.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace StockManager.Services
{
    public interface IStockNewsService
    {
        Task<List<StockNews>> GetNews();
        Task RefreshNews();
    }
    public class StockNewsService : IStockNewsService
    {
        private List<StockNews> _cachedNews = new List<StockNews>();
        private readonly string _finnhubApiKey;
        private readonly HttpClient _httpClient;

        public StockNewsService (IConfiguration configuration, HttpClient httpClient)
        {
            _finnhubApiKey = configuration["FinnhubApiKey:ApiKey"] ?? "";
            _httpClient = httpClient;
        }

        public async Task<List<StockNews>> GetNews()
        {            
            if(_cachedNews == null || _cachedNews.Count == 0)
            {
                await RefreshNews();
            }
            Console.WriteLine(_cachedNews[0].HeadLine);
            return _cachedNews;
        }
        public async Task RefreshNews()
        {
            if (string.IsNullOrWhiteSpace(_finnhubApiKey))
            {
                Console.WriteLine("Finnhub API kulcs nincs beállítva.");
                return;
            }

            var getData = $"https://finnhub.io/api/v1/news?category=general&token={_finnhubApiKey}";
            var response = await _httpClient.GetAsync(getData);
            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Error: {response.StatusCode}");
            }
            var responseString = await response.Content.ReadAsStringAsync();

            _cachedNews = JsonSerializer.Deserialize<List<StockNews>>(responseString);
        }
    }
}
