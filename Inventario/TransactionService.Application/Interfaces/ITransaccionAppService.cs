using TransactionService.Application.DTOs;

namespace TransactionService.Application.Interfaces
{
    public interface ITransaccionAppService
    {
        Task<object> GetPagedAsync(
            int? idProducto,
            string? tipoTransaccion,
            DateTime? fechaInicio,
            DateTime? fechaFin,
            int page,
            int pageSize);

        Task<TransaccionResponseDto?> GetByIdAsync(long id);
        Task<TransaccionResponseDto> CreateAsync(TransaccionRequestDto request);
        Task UpdateAsync(long id, TransaccionRequestDto request);
        Task DeleteAsync(long id);
    }
}
