using ProductService.Application.DTOs;

namespace ProductService.Application.Interfaces
{
    public interface IProductoAppService
    {
        Task<ProductoResponseDto?> GetByIdAsync(int id);
        Task<object> GetPagedAsync(
            string? nombre,
            int? idCategoria,
            bool? estado,
            decimal? precioMin,
            decimal? precioMax,
            int page,
            int pageSize);

        Task<ProductoResponseDto> CreateAsync(ProductoRequestDto request);
        Task UpdateAsync(int id, ProductoRequestDto request);
        Task DeleteAsync(int id);
        Task AdjustStockAsync(int id, AjusteStockRequestDto request);
        Task<string> SaveImageAsync(Stream fileStream, string fileName);
    }
}
