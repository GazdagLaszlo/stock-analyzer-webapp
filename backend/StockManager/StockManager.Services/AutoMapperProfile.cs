using AutoMapper;
using StockManager.DataContext.Entities;
using StockManager.DataContext.DTOs;

namespace StockManager.Services
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile() 
        {
            CreateMap<UserCreateDto, User>();
            CreateMap<User, UserDto>();
            CreateMap<UserUpdateDto, User>();

            CreateMap<StockCreateDto, Stock>();
            CreateMap<Stock, StockDto>()
                .ForMember(dest => dest.StockDataId, opt => opt.MapFrom(src => src.StockData.Id));
            CreateMap<StockUpdateDto, Stock>()
                .ForMember(dest => dest.MarketCap, opt => opt.MapFrom(src => src.MarketCap))
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<Portfolio, PortfolioDto>();
            CreateMap<PortfolioCreateDto, Portfolio>();
            CreateMap<PortfolioUpdateDto, Portfolio>();
            CreateMap<PortfolioUpdateDto, PortfolioDto>();

            CreateMap<PortfolioItem, PortfolioItemDto>();
            CreateMap<PortfolioItemCreateDto, PortfolioItem>();
            CreateMap<PortfolioItemUpdateDto, PortfolioItem>();
            CreateMap<PortfolioItemUpdateDto, PortfolioDto>();

            CreateMap<Transaction, TransactionDto>();
            CreateMap<TransactionCreateDto, Transaction>()
                .ForMember(dest => dest.Fee, opt => opt.MapFrom(src => src.Fee ?? 0))
                .ForMember(dest => dest.Note, opt => opt.MapFrom(src => src.Note ?? string.Empty));
            CreateMap<TransactionUpdateDto, Transaction>();

            CreateMap<WatchList, WatchListDto>();

            CreateMap<WatchListItem, WatchListItemDto>();
            CreateMap<WatchListItemCreateDto, WatchListItem>();
            CreateMap<WatchListItemUpdateDto, WatchListItem>();

            CreateMap<StockData, StockDataDto>();
            CreateMap<StockDataCreateDto, StockData>();
            CreateMap<StockDataUpdateDto, StockData>()
                .ForMember(dest => dest.StockDataItems, opt => opt.Ignore());
            CreateMap<StockDataCreateDto, StockDataUpdateDto>()
                .ForMember(dest => dest.StockDataItems, opt => opt.Ignore());

            CreateMap<StockDataItem, StockDataItemDto>().ReverseMap();

            CreateMap<StockReport, StockReportDto>();

            CreateMap<StockReportItem, StockReportItemDto>();

            CreateMap<Article, ArticleDto>().ReverseMap();
            CreateMap<ArticleCreateUpdateDto, ArticleDto>();
            CreateMap<ArticleCreateUpdateDto, Article>();
        }
    }
}
    