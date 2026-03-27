using Microsoft.EntityFrameworkCore;
using ProductService.Application.Interfaces;
using ProductService.Domain.Entities;
using ProductService.Infrastructure.Persistence;

namespace ProductService.Infrastructure.Repositories
{
    public class ProductoRepository : IProductoRepository
    {
        private readonly ProductDbContext _context;

        public ProductoRepository(ProductDbContext context)
        {
            _context = context;
        }

        public async Task<Producto?> GetByIdAsync(int id)
        {
            return await _context.Productos
                .Include(x => x.Categoria)
                .FirstOrDefaultAsync(x => x.IdProducto == id);
        }

        public async Task<(IEnumerable<Producto> Items, int Total)> GetPagedAsync(
            string? nombre,
            int? idCategoria,
            bool? estado,
            decimal? precioMin,
            decimal? precioMax,
            int page,
            int pageSize)
        {
            var query = _context.Productos.Include(x => x.Categoria).AsQueryable();

            if (!string.IsNullOrWhiteSpace(nombre))
                query = query.Where(x => x.Nombre.Contains(nombre));

            if (idCategoria.HasValue)
                query = query.Where(x => x.IdCategoria == idCategoria.Value);

            if (estado.HasValue)
                query = query.Where(x => x.Estado == estado.Value);

            if (precioMin.HasValue)
                query = query.Where(x => x.Precio >= precioMin.Value);

            if (precioMax.HasValue)
                query = query.Where(x => x.Precio <= precioMax.Value);

            var total = await query.CountAsync();

            var items = await query.OrderByDescending(x => x.IdProducto)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, total);
        }

        public async Task AddAsync(Producto entity)
        {
            await _context.Productos.AddAsync(entity);
        }

        public Task UpdateAsync(Producto entity)
        {
            _context.Productos.Update(entity);
            return Task.CompletedTask;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
