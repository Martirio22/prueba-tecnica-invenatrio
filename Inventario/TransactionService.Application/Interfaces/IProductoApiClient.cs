using Shared.Contracts.DTOs;

namespace TransactionService.Application.Interfaces
{
    public interface IProductoApiClient
    {
        Task<ProductInfoDto?> GetProductByIdAsync(int idProducto);
        Task<bool> IncreaseStockAsync(int idProducto, int cantidad);
        Task<bool> DecreaseStockAsync(int idProducto, int cantidad);
    }
}
