using Shared.Contracts.DTOs;
using System.Net.Http.Json;
using TransactionService.Application.Interfaces;

namespace TransactionService.Infrastructure.Clients
{
    public class ProductoApiClient : IProductoApiClient
    {
        private readonly HttpClient _httpClient;

        public ProductoApiClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<ProductInfoDto?> GetProductByIdAsync(int idProducto)
        {
            var response = await _httpClient.GetAsync($"/api/productos/{idProducto}");
            if (!response.IsSuccessStatusCode)
                return null;

            return await response.Content.ReadFromJsonAsync<ProductInfoDto>();
        }

        public async Task<bool> IncreaseStockAsync(int idProducto, int cantidad)
        {
            var response = await _httpClient.PutAsJsonAsync(
                $"/api/productos/{idProducto}/stock/ajustar",
                new { cantidad, operacion = "sumar" });

            return response.IsSuccessStatusCode;
        }

        public async Task<bool> DecreaseStockAsync(int idProducto, int cantidad)
        {
            var response = await _httpClient.PutAsJsonAsync(
                $"/api/productos/{idProducto}/stock/ajustar",
                new { cantidad, operacion = "restar" });

            return response.IsSuccessStatusCode;
        }
    }
}
