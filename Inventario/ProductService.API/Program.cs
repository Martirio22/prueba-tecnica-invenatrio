//var builder = WebApplication.CreateBuilder(args);

//// Add services to the container.

//builder.Services.AddControllers();
//// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
//builder.Services.AddOpenApi();

//var app = builder.Build();

//// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.MapOpenApi();
//}

//app.UseHttpsRedirection();

//app.UseAuthorization();

//app.MapControllers();

//app.Run();



//------------------------------------------------------------
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using ProductService.API.Middlewares;
using ProductService.Application.Interfaces;
using ProductService.Application.Services;
using ProductService.Infrastructure.Persistence;
using ProductService.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ProductDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ICategoriaRepository, CategoriaRepository>();
builder.Services.AddScoped<IProductoRepository, ProductoRepository>();
builder.Services.AddScoped<ICategoriaAppService, CategoriaAppService>();

builder.Services.AddScoped<IProductoAppService>(sp =>
{
    var productoRepository = sp.GetRequiredService<IProductoRepository>();
    var categoriaRepository = sp.GetRequiredService<ICategoriaRepository>();
    var env = sp.GetRequiredService<IWebHostEnvironment>();

    var webRootPath = Path.Combine(env.ContentRootPath, "wwwroot");
    var uploadRoot = Path.Combine(webRootPath, "uploads", "productos");

    return new ProductoAppService(productoRepository, categoriaRepository, uploadRoot);
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .AllowAnyOrigin());
});

var app = builder.Build();

var webRootPath = Path.Combine(app.Environment.ContentRootPath, "wwwroot");
var uploadsPath = Path.Combine(webRootPath, "uploads");
var productosPath = Path.Combine(uploadsPath, "productos");

if (!Directory.Exists(webRootPath))
    Directory.CreateDirectory(webRootPath);

if (!Directory.Exists(uploadsPath))
    Directory.CreateDirectory(uploadsPath);

if (!Directory.Exists(productosPath))
    Directory.CreateDirectory(productosPath);

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(webRootPath),
    RequestPath = ""
});

app.UseCors("AllowAngular");

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseAuthorization();
app.MapControllers();

app.Run();