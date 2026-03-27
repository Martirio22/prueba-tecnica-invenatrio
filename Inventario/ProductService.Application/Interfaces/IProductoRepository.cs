using ProductService.Domain.Entities;

namespace ProductService.Application.Interfaces
{
    public interface IProductoRepository
    {
        Task<Producto?> GetByIdAsync(int id);
        Task<(IEnumerable<Producto> Items, int Total)> GetPagedAsync(
            string? nombre,
            int? idCategoria,
            bool? estado,
            decimal? precioMin,
            decimal? precioMax,
            int page,
            int pageSize);

        Task AddAsync(Producto entity);
        Task UpdateAsync(Producto entity);
        Task SaveChangesAsync();
    }
}
