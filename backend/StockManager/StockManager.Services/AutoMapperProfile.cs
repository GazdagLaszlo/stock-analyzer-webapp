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
        }
    }
}
    