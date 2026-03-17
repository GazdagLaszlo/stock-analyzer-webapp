using AutoMapper;
using Microsoft.EntityFrameworkCore;
using StockManager.DataContext.Context;
using StockManager.DataContext.DTOs;
using StockManager.DataContext.Entities;

namespace StockManager.Services
{
    public interface IArticleService
    {
        Task<ArticleDto> CreateAsync(ArticleCreateUpdateDto createDto);
        Task<ArticleDto> GetByIdAsync(int id);
        Task<IEnumerable<ArticleDto>> GetAllAsync(string? search = null, string? topic = null);
        Task<ArticleDto> UpdateAsync(int id, ArticleCreateUpdateDto updateDto);
        Task DeleteAsync(int id);
    }

    public class ArticleService(AppDbContext context, IMapper mapper) : IArticleService
    {
        public async Task<ArticleDto> CreateAsync(ArticleCreateUpdateDto createDto)
        {
            var article = mapper.Map<Article>(createDto);

            await context.Articles.AddAsync(article);
            await context.SaveChangesAsync();

            return mapper.Map<ArticleDto>(article);
        }

        public async Task<ArticleDto> GetByIdAsync(int id)
        {
            var article = await context.Articles                
                .FirstOrDefaultAsync(x => x.Id == id);

            if (article == null)
                throw new KeyNotFoundException($"Article with id - {id} not found!");

            return mapper.Map<ArticleDto>(article);
        }

        public async Task<IEnumerable<ArticleDto>> GetAllAsync(string? search = null, string? topic = null)
        {
            var query = context.Articles                
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(topic))
            {
                query = query.Where(x => x.Topic == topic);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(x =>
                    x.Title.ToLower().Contains(search.ToLower()) ||
                    x.Content.ToLower().Contains(search.ToLower()));
            }

            var articles = await query.ToListAsync();

            return mapper.Map<IEnumerable<ArticleDto>>(articles);
        }

        public async Task<ArticleDto> UpdateAsync(int id, ArticleCreateUpdateDto updateDto)
        {
            var article = await context.Articles
                .FirstOrDefaultAsync(x => x.Id == id);

            if (article == null)
                throw new KeyNotFoundException($"Article with id - {id} not found!");

            mapper.Map(updateDto, article);
            await context.SaveChangesAsync();

            return mapper.Map<ArticleDto>(article);
        }

        public async Task DeleteAsync(int id)
        {
            var article = await context.Articles
                .FirstOrDefaultAsync(x => x.Id == id);

            if (article == null)
                throw new KeyNotFoundException($"Article with id - {id} not found!");

            context.Articles.Remove(article);
            await context.SaveChangesAsync();
        }
    }
}