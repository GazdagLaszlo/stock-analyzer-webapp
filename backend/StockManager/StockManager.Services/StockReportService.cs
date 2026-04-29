using AutoMapper;
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

    public class RootResponse
    {
        public string cik { get; set; }
        public ResponseData[] data { get; set; }
        public string symbol { get; set; }
    }

    public class ResponseData
    {
        public string accessNumber { get; set; }
        public string symbol { get; set; }
        public string cik { get; set; }
        public int year { get; set; }
        public int quarter { get; set; }
        public string form { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string filedDate { get; set; }
        public string acceptedDate { get; set; }
        public Report report { get; set; }
    }

    public class Report
    {
        public Bs[] bs { get; set; }
        public Ic[] ic { get; set; }
        public Cf[] cf { get; set; }
    }

    public class Bs
    {
        public string concept { get; set; }
        public string unit { get; set; }
        public string label { get; set; }
        public JsonElement value { get; set; }
    }

    public class Ic
    {
        public string concept { get; set; }
        public string unit { get; set; }
        public string label { get; set; }
        public JsonElement value { get; set; }
    }

    public class Cf
    {
        public string concept { get; set; }
        public string unit { get; set; }
        public string label { get; set; }
        public JsonElement value { get; set; }
    }


    public interface IStockReportService
    {
        Task GetStockReportsFromAPI(string symbol);
        Task<List<StockReportDto>> GetStockReportsBySymbol(string symbol);
    }
    public class StockReportService : IStockReportService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly string _finnhubApiKey;
        private readonly HttpClient _httpClient;
        public StockReportService(AppDbContext context, IMapper mapper, IConfiguration configuration, HttpClient httpClient)
        {
            _context = context;
            _mapper = mapper;
            _finnhubApiKey = configuration["FinnhubApiKey:ApiKey"] ?? "";
            _httpClient = httpClient;
        }

        //ANNUAL REPORTS
        public async Task GetStockReportsFromAPI(string symbol)
        {
            if (string.IsNullOrWhiteSpace(_finnhubApiKey))
            {
                Console.WriteLine("Finnhub API kulcs nincs beállítva.");
                return;
            }

            //Ellenőrizni, hogy nincs-e adatbázisban a legfrissebb jelentés.
            //Ha már van, akkor ne is induljon api lekérés, ezzel is csökkenthető a kérések száma.
            /*
            var stockReports = await _context.StockReports                
                .Where(x => x.Stock.Symbol == symbol)
                .ToListAsync();
            if(stockReports.Any(x => x.Year))
            */

            var getData = $"https://finnhub.io/api/v1/stock/financials-reported?symbol={symbol}&token={_finnhubApiKey}";
            while (true)
            {
                var response = await _httpClient.GetAsync(getData);
                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Error: {response.StatusCode}");
                }
                var responseString = await response.Content.ReadAsStringAsync();

                var reportData = JsonSerializer.Deserialize<RootResponse>(responseString);

                if (response.IsSuccessStatusCode)
                {
                    //Ha több jelentés van, kiválasztjuk a legkésőbbi elfogadottat.
                    List<ResponseData> responseData = new List<ResponseData>();
                    var latestReport = reportData.data
                        .GroupBy(x => x.year)
                        .Select(x => x.OrderByDescending(x => x.acceptedDate).First());
                    responseData.AddRange(latestReport);

                    if (responseData != null && responseData.Count != 0)
                    {
                        var stock = await _context.Stocks.FirstOrDefaultAsync(x => x.Symbol == symbol);

                        foreach (var data in responseData)
                        {                            
                            var existing = await _context.StockReports
                                .FirstOrDefaultAsync(x => x.AccessNumber == data.accessNumber);

                            if (existing != null)
                            {
                                continue;
                            }

                            var report = new StockReport
                            {
                                StockId = stock.Id,
                                AccessNumber = data.accessNumber,
                                Year = data.year,
                                Quarter = data.quarter,
                                StartDate = DateTime.Parse(data.startDate),
                                EndDate = DateTime.Parse(data.endDate),
                                FiledDate = DateTime.Parse(data.filedDate),

                                StockReportItems = new List<StockReportItem>()
                            };

                            foreach (var bs in data.report.bs)
                            {
                                //Van, hogy N/A a value értéke json-ben
                                double value = 0;

                                if (bs.value.ValueKind == JsonValueKind.Number)
                                {
                                    value = bs.value.GetDouble();
                                }
                                else if (bs.value.ValueKind == JsonValueKind.String)
                                {
                                    double.TryParse(bs.value.GetString(), out value);
                                }

                                report.StockReportItems.Add(new StockReportItem
                                {
                                    ReportSection = "bs",
                                    Concept = bs.concept,
                                    Label = string.IsNullOrEmpty(bs.label) ? bs.concept : bs.label,
                                    Unit = bs.unit,
                                    Value = value
                                });
                            }

                            foreach (var ic in data.report.ic)
                            {
                                double value = 0;

                                if (ic.value.ValueKind == JsonValueKind.Number)
                                {
                                    value = ic.value.GetDouble();
                                }
                                else if (ic.value.ValueKind == JsonValueKind.String)
                                {
                                    double.TryParse(ic.value.GetString(), out value);
                                }

                                report.StockReportItems.Add(new StockReportItem
                                {
                                    ReportSection = "ic",
                                    Concept = ic.concept,
                                    Label = string.IsNullOrEmpty(ic.label) ? ic.concept : ic.label,
                                    Unit = ic.unit,
                                    Value = value
                                });
                            }

                            foreach (var cf in data.report.cf)
                            {
                                double value = 0;

                                if (cf.value.ValueKind == JsonValueKind.Number)
                                {
                                    value = cf.value.GetDouble();
                                }
                                else if (cf.value.ValueKind == JsonValueKind.String)
                                {
                                    double.TryParse(cf.value.GetString(), out value);
                                }

                                report.StockReportItems.Add(new StockReportItem
                                {
                                    ReportSection = "cf",
                                    Concept = cf.concept,
                                    Label = string.IsNullOrEmpty(cf.label) ? cf.concept : cf.label,
                                    Unit = cf.unit,
                                    Value = value
                                });
                            }
                            _context.StockReports.Add(report);
                            await _context.SaveChangesAsync();

                            Console.WriteLine($"Stockreport to {symbol} saved!");
                        }
                    }
                    else
                    {
                        Console.WriteLine($"Stockreport not found to symbol - {symbol}");
                        return;
                    }
                }
                else
                {
                    if (response.StatusCode == System.Net.HttpStatusCode.UnprocessableEntity)
                    {
                        Console.WriteLine($"No financial report found to symbol - {symbol}");
                        return;
                    }

                    if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
                    {
                        Console.WriteLine("Too many requests. API limit reached.");
                        await Task.Delay(5000);
                        continue;
                    }
                }

                break;
            }
        }

        public async Task<List<StockReportDto>> GetStockReportsBySymbol(string symbol)
        {
            var stockReports = await _context.StockReports
                .Include(x => x.StockReportItems)
                .Where(x => x.Stock.Symbol == symbol)
                .ToListAsync();

            return _mapper.Map<List<StockReportDto>>(stockReports);
        }
    }
}
