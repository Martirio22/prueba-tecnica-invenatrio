using ProductService.Domain.Entities;

namespace ProductService.Application.Interfaces
{
    public interface ICategoriaRepository
    {
        Task<IEnumerable<Categoria>> GetAllAsync();
        Task<Categoria?> GetByIdAsync(int id);
        Task AddAsync(Categoria entity);
        Task UpdateAsync(Categoria entity);
        Task SaveChangesAsync();
    }
}
