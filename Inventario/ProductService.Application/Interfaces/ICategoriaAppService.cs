using ProductService.Application.DTOs;

namespace ProductService.Application.Interfaces
{
    public interface ICategoriaAppService
    {
        Task<IEnumerable<CategoriaResponseDto>> GetAllAsync();
        Task<CategoriaResponseDto?> GetByIdAsync(int id);
        Task<CategoriaResponseDto> CreateAsync(CategoriaRequestDto request);
        Task UpdateAsync(int id, CategoriaRequestDto request);
        Task DeleteAsync(int id);
    }
}
