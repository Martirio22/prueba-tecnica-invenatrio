using Microsoft.EntityFrameworkCore;
using TransactionService.Application.Interfaces;
using TransactionService.Domain.Entities;
using TransactionService.Infrastructure.Persistence;

namespace TransactionService.Infrastructure.Repositories
{
    public class TransaccionRepository : ITransaccionRepository
    {
        private readonly TransactionDbContext _context;

        public TransaccionRepository(TransactionDbContext context)
        {
            _context = context;
        }

        public async Task<TransaccionInventario?> GetByIdAsync(long id)
        {
            return await _context.TransaccionesInventario.FirstOrDefaultAsync(x => x.IdTransaccionInventario == id);
        }

        public async Task<(IEnumerable<TransaccionInventario> Items, int Total)> GetPagedAsync(
            int? idProducto,
            string? tipoTransaccion,
            DateTime? fechaInicio,
            DateTime? fechaFin,
            int page,
            int pageSize)
        {
            var query = _context.TransaccionesInventario.AsQueryable();

            if (idProducto.HasValue)
                query = query.Where(x => x.IdProducto == idProducto.Value);

            if (!string.IsNullOrWhiteSpace(tipoTransaccion))
                query = query.Where(x => x.TipoTransaccion == tipoTransaccion);

            if (fechaInicio.HasValue)
                query = query.Where(x => x.Fecha >= fechaInicio.Value);

            if (fechaFin.HasValue)
                query = query.Where(x => x.Fecha <= fechaFin.Value);

            var total = await query.CountAsync();

            var items = await query.OrderByDescending(x => x.IdTransaccionInventario)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, total);
        }

        public async Task AddAsync(TransaccionInventario entity)
        {
            await _context.TransaccionesInventario.AddAsync(entity);
        }

        public Task UpdateAsync(TransaccionInventario entity)
        {
            _context.TransaccionesInventario.Update(entity);
            return Task.CompletedTask;
        }

        public Task DeleteAsync(TransaccionInventario entity)
        {
            _context.TransaccionesInventario.Remove(entity);
            return Task.CompletedTask;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
