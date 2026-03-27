using TransactionService.Domain.Entities;

namespace TransactionService.Application.Interfaces
{
    public interface ITransaccionRepository
    {
        Task<TransaccionInventario?> GetByIdAsync(long id);
        Task<(IEnumerable<TransaccionInventario> Items, int Total)> GetPagedAsync(
            int? idProducto,
            string? tipoTransaccion,
            DateTime? fechaInicio,
            DateTime? fechaFin,
            int page,
            int pageSize);

        Task AddAsync(TransaccionInventario entity);
        Task UpdateAsync(TransaccionInventario entity);
        Task DeleteAsync(TransaccionInventario entity);
        Task SaveChangesAsync();
    }
}
