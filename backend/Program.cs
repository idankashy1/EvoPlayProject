using EvoPlay._3._Repository.Contract;
using EvoPlay._3._Repository.Implementation;
using EvoPlay.BL.Contract;
using EvoPlay.BL.Implementation;
using EvoPlay.DAL;
using EvoPlay.DAL.Contract;
using EvoPlay.DAL.Implementation;
using EvoPlay.Entities;
using EvoPlay.Repository.Contract;
using EvoPlay.Repository.Implementation;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<GameCenterContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
           .EnableSensitiveDataLogging() // Add this line for more detailed errors
           .EnableDetailedErrors());


builder.Services.AddControllers();
builder.Logging.ClearProviders();
builder.Logging.AddConsole(); 
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(option =>
{
    option.AddPolicy("MyPolicy", builder =>
    {
        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
}); 

builder.Services.AddScoped<IContactService, ContactService>();
builder.Services.AddScoped<IEmailRepository, EmailRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IBookingBL, BookingBL>();
builder.Services.AddScoped<IPackageService, PackageService>();
builder.Services.AddScoped<IPackageRepository, PackageRepository>();
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUserBL, UserBL>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("MyPolicy");
app.UseAuthorization();

app.MapControllers();

app.Run();