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
    public interface ITransactionStatisticsService
    {
        Task<TradeSummaryDto> GetTransactionsSummary(int userId);
        Task<List<TradeInsightDto>> GetTradeInsight(int userId);
    }
    public class TransactionStatisticsService(AppDbContext context, IMapper mapper) : ITransactionStatisticsService
    {
        public async Task<List<TradeInsightDto>> GetTradeInsight(int userId)
        {
            var tradeSummary = await GetTransactionsSummary(userId);
            List<TradeInsightDto> tradeInsights = new List<TradeInsightDto>();

            var profits = tradeSummary.ClosedTrades?
                .Where(x => x.RealizedProfit > 0)
                .Select(x => x.RealizedProfit)
                .ToList();
            var profitMedian = GetMedianFromProfits(profits);

            var positionSizes = tradeSummary.ClosedTrades?                
                .Select(x => x.PositionSize)
                .ToList();
            var positionSizeCons = GetPositionSizeConsistency(positionSizes);

            if (tradeSummary.AverageRRR < 1)
            {
                tradeInsights.Add(new TradeInsightDto
                {
                    Title = "Critical Risk-Reward Profile",
                    Explanation = "The risk-reward ratio is critically low, indicating that losses are larger than gains, making the strategy unsustainable.",
                    Advice = "Make sure every trade you take offers at least 1:1.5 risk-to-reward — ideally 1:2.",
                    Type = TradeInsightType.Danger,
                });
            }
            else if (tradeSummary.AverageRRR < 1.5)
            {
                tradeInsights.Add(new TradeInsightDto {
                    Title = "Poor Risk-Reward Profile",
                    Explanation = "The risk-reward ratio is suboptimal, meaning profits are not sufficiently larger than losses to justify the risk.",
                    Advice = "Make sure every trade you take offers at least 1:1.5 risk-to-reward — ideally 1:2.",
                    Type = TradeInsightType.Warning,
                });
            }
            if (tradeSummary.ProfitFactor < 1)
            {
                tradeInsights.Add(new TradeInsightDto
                {
                    Title = "Critical Profitability (Low Profit Factor)",
                    Explanation = "The profit factor is below break-even levels, meaning the strategy is not profitable overall.",
                    Advice = "The strategy is overall unprofitable, consider a full strategy review.",
                    Type = TradeInsightType.Danger,
                });
            }
            else if (tradeSummary.ProfitFactor < 1.5)
            {
                tradeInsights.Add(new TradeInsightDto
                {
                    Title = "Weak Profitability (Low Profit Factor)",
                    Explanation = "The profit factor is low, indicating that total profits are only slightly higher than total losses or not sufficiently strong.",
                    Advice = "Tighten your entry criteria and Stop-Loss levels.",
                    Type = TradeInsightType.Warning,
                });
            }            
            if (tradeSummary.WinRate < 40)
            {
                tradeInsights.Add(new TradeInsightDto
                {
                    Title = "Low Win Rate",
                    Explanation = "The proportion of winning trades is too low, indicating that most trades are unsuccessful.",
                    Advice = "Tighten your entry criteria and consider sitting out during low-conviction market conditions.",
                    Type = TradeInsightType.Warning,
                });
            }
            if (tradeSummary.WinRate > 60 && tradeSummary.ProfitFactor < 1.5)
            {
                tradeInsights.Add(new TradeInsightDto
                {
                    Title = "Unprofitable Despite High Win Rate",
                    Explanation = "The strategy has many winning trades, but the gains are too small compared to losses, resulting in overall unprofitability.",
                    Advice = "Focus on cutting losses faster and letting profitable trades run longer using a trailing stop.",
                    Type = TradeInsightType.Warning,
                });
            }
            if (tradeSummary.WorstTrade?.RealizedProfit > tradeSummary.AverageGain * 1.5)
            {
                tradeInsights.Add(new TradeInsightDto
                {
                    Title = "Excessive Tail Loss Exposure",
                    Explanation = "Individual trades occasionally result in disproportionately large losses that negatively impact overall performance.",
                    Advice = "Introduce a hard maximum loss limit per trade.",
                    Type = TradeInsightType.Danger,
                });
            }
            if (tradeSummary.BestTrade?.RealizedProfit > tradeSummary.TotalWin * 0.5)
            {
                tradeInsights.Add(new TradeInsightDto
                {
                    Title = "Low Quality Returns",
                    Explanation = "A large portion of total profit comes from a small number of trades, indicating an unstable and non-uniform performance distribution.",
                    Advice = "Try to figure out what your best trade made work and see if you can build that into your regular strategy.",
                    Type = TradeInsightType.Info,
                });
            }
            if (tradeSummary.AverageGain > tradeSummary.AverageLoss)
            {
                tradeInsights.Add(new TradeInsightDto
                {
                    Title = "Negative Expectancy: Losses Outweigh Gains",
                    Explanation = "The average loss per trade is greater than the average gain, resulting in a consistently losing strategy over time.",
                    Advice = "Tighten Stop-Loss levels or increase Take Profit targets.",
                    Type = TradeInsightType.Danger,
                });
            }
            if (tradeSummary.WorstTrade?.RealizedProfit*0.85 >= tradeSummary.AverageGain)
            {
                tradeInsights.Add(new TradeInsightDto
                {
                    Title = "Risk Management Failure (Stop-Loss Misconfiguration)",
                    Explanation = "The strategy lacks proper stop-loss placement or uses poorly calibrated stop-loss levels, exposing trades to disproportionate risk.",
                    Advice = "Focus on cutting losses faster.",
                    Type = TradeInsightType.Warning,
                });
            }
            if (profitMedian != null && profitMedian < tradeSummary.AverageGain)
            {
                tradeInsights.Add(new TradeInsightDto
                {
                    Title = "Suboptimal Trade Profit Capture",
                    Explanation = "The median profit per winning trade is low, suggesting that profitable trades are not fully capitalized on.",
                    Advice = "Consider a partial close combined with a trailing stop to better capitalize on trending moves.",
                    Type = TradeInsightType.Info,
                });
            }

            if (positionSizeCons != null && positionSizeCons > 0.5)
            {
                tradeInsights.Add(new TradeInsightDto
                {
                    Title = "Inconsistent Position Sizing Discipline",
                    Explanation = "Trade sizes vary significantly without a consistent risk management approach, leading to unstable performance.",
                    Advice = "Adopt a fixed risk-based position sizing model.",
                    Type = TradeInsightType.Info,
                });
            }

            tradeInsights =  tradeInsights.OrderByDescending(x => x.Type).ToList();


            return tradeInsights;
        }

        public double? GetMedianFromProfits(List<double> profits)
        {
            if (profits == null || profits.Count() == 0)
            {
                return null;
            }

            var sortedProfits = profits.OrderBy(x => x).ToList();
            int count = sortedProfits.Count();

            if (count % 2 == 1)
            {
                return sortedProfits[count / 2];
            }
            else
            {
                double profit1 = sortedProfits[(count / 2) -1];
                double profit2 = sortedProfits[count / 2];
                return (profit1 + profit2) / 2;
            }
        }

        public double? GetPositionSizeConsistency(List<double> investedValues)
        {
            if (investedValues == null || investedValues.Count() == 0)
            {
                return null;
            }

            double average = investedValues.Average();

            double diffsPowAvg = investedValues
                .Select(x => Math.Pow(x - average, 2))
                .Average();

            double x = Math.Sqrt(diffsPowAvg);
            return x / diffsPowAvg;
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
                   Sector = x.First().Stock.Sector,
                   PositionSize = x
                    .Where(x => x.TransactionType == TransactionType.Buy)
                    .Sum(x => x.Quantity * x.Price),
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
                TotalVolume = allTransactions.Count() != 0 ? allTransactions.Sum(x => x.Price + (x.Fee ?? 0)) : null,
                TotalWin = totalWins,
                TotalLoss = totalLosses,
            };
        }
    }
}
