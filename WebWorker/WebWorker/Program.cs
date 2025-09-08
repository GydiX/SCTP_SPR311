using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebWorker.Data;
using WebWorker.Data.Entities.Identity;
using WebWorker.Interfaces;
using WebWorker.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<AppWorkerDbContext>(opt =>
{
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddIdentity<UserEntity, RoleEntity>(opt =>
{
    opt.Password.RequiredLength = 6;
    opt.Password.RequireDigit = false;
    opt.Password.RequireLowercase = false;
    opt.Password.RequireUppercase = false;
    opt.Password.RequireNonAlphanumeric = false;

})
    .AddEntityFrameworkStores<AppWorkerDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddSingleton<ISpotifyAuthService, SpotifyAuthService>();

builder.Services.AddSwaggerGen();

builder.Services.AddCors();

var app = builder.Build();

//Console.WriteLine(builder.Configuration["ClientAppUrl"]);

app.UseCors(opt =>
{
    opt.AllowAnyHeader()
       .AllowAnyMethod()
       .AllowCredentials()
       .SetIsOriginAllowed(origin => true); // Дозволяємо всі origins для тестування
});

app.UseSwagger();
app.UseSwaggerUI();

// Serve static images
var imagesDirName = "images";
string imagesPath = Path.Combine(Directory.GetCurrentDirectory(), imagesDirName);
Directory.CreateDirectory(imagesPath);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(imagesPath),
    RequestPath = $"/{imagesDirName}"
});

// Serve static audio
var audioDirName = "audio";
string audioPath = Path.Combine(Directory.GetCurrentDirectory(), audioDirName);
Directory.CreateDirectory(audioPath);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(audioPath),
    RequestPath = $"/{audioDirName}"
});

// Configure the HTTP request pipeline.

app.UseAuthorization();

app.MapControllers();

await app.SeedData();

app.Run();
