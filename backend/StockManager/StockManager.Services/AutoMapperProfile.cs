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
            CreateMap<Stock, StockDto>();
            CreateMap<StockUpdateDto, Stock>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<Portfolio, PortfolioDto>();
            CreateMap<PortfolioCreateDto, Portfolio>();
            CreateMap<PortfolioUpdateDto, Portfolio>();
        }
    }
}
    