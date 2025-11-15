using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using StockManager.DataContext.Context;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using StockManager.Services;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using StockManager.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddHttpClient();

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite("Filename=stockmanagerDB.db"));

builder.Services.AddScoped<StockUpdaterService>();
builder.Services.AddScoped<IStockService, StockService>();
builder.Services.AddHostedService<StockUpdaterBackgroundService>();
builder.Services.AddHttpClient<StockUpdaterService>();


builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IStockService, StockService>();
builder.Services.AddScoped<IPortfolioService, PortfolioService>();
builder.Services.AddScoped<IPortfolioItemService, PortfolioItemService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<IWatchListService, WatchListService>();
builder.Services.AddScoped<IWatchListItemService, WatchListItemService>();
builder.Services.AddScoped<IStockDataService, StockDataService>();
builder.Services.AddScoped<IStockNewsService, StockNewsService>();
builder.Services.AddScoped<IStockReportService, StockReportService>();

builder.Services.AddHostedService<StockUpdaterBackgroundService>();
builder.Services.AddHostedService<StockNewsBackgroundService>();

builder.Services.AddScoped<StockUpdaterService>();
builder.Services.AddHttpClient<StockUpdaterService>();

builder.Services.AddSignalR();
builder.Services.AddSingleton<IPriceBroadcaster, PriceBroadcaster>();
builder.Services.AddSingleton<StockPriceUpdaterWebSocketService>();
//builder.Services.AddHttpClient<StockPriceUpdaterWebSocketService>();


builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear(); // => remove default claims
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "https://localhost:5201",
            ValidAudience = "https://localhost:5201",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("randomSztring12345_x2____randomSztring12345_x2")),
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdministratorPolicy", policy => policy.RequireRole("Administrator"));
    options.AddPolicy("InvestorPolicy", policy => policy.RequireRole("Investor"));
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
        });
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Swagger configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "StockManager API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjMiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiR2F6ZGFnIEzDoXN6bMOzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoidGVzdEB0ZXN0LmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkludmVzdG9yIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvc2lkIjoiZGMyZWYyYzYtMzllNC00YjhmLWIzOTQtNTllNTVmOTg3MzhkIiwiYXV0aF90aW1lIjoiMDgvMjUvMjAyNSAxNzoyMjoyMiIsImV4cCI6MTc1NjU2NzM0MiwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTE2MCIsImF1ZCI6Imh0dHBzOi8vbG9jYWxob3N0OjUxNjAifQ.gScb8wvtCss7bqX2CbBHItiv2VU6i6FbzgKkjADnZJA",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement {
    {
        new OpenApiSecurityScheme {
            Reference = new OpenApiReference {
                Type = ReferenceType.SecurityScheme,
                Id = "Bearer"
            }
        },
        new string[] { }
    }});
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "StockManager API v1"));
}

var webSocketOptions = new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromMinutes(2)
};
//webSocketOptions.AllowedOrigins.Add("http://localhost:5173");
app.UseWebSockets(webSocketOptions);

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors("AllowFrontend");
app.MapHub<StockPriceHub>("/stockPriceHub");

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
