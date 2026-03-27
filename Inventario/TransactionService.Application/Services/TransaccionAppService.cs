using TransactionService.Application.DTOs;
using TransactionService.Application.Interfaces;
using TransactionService.Domain.Entities;

namespace TransactionService.Application.Services
{
    public class TransaccionAppService : ITransaccionAppService
    {
        private readonly ITransaccionRepository _repository;
        private readonly IProductoApiClient _productoApiClient;

        public TransaccionAppService(ITransaccionRepository repository, IProductoApiClient productoApiClient)
        {
            _repository = repository;
            _productoApiClient = productoApiClient;
        }

        public async Task<object> GetPagedAsync(
            int? idProducto,
            string? tipoTransaccion,
            DateTime? fechaInicio,
            DateTime? fechaFin,
            int page,
            int pageSize)
        {
            var result = await _repository.GetPagedAsync(idProducto, tipoTransaccion, fechaInicio, fechaFin, page, pageSize);

            var items = new List<TransaccionResponseDto>();

            foreach (var item in result.Items)
            {
                var producto = await _productoApiClient.GetProductByIdAsync(item.IdProducto);

                items.Add(new TransaccionResponseDto
                {
                    IdTransaccionInventario = item.IdTransaccionInventario,
                    Fecha = item.Fecha,
                    TipoTransaccion = item.TipoTransaccion,
                    IdProducto = item.IdProducto,
                    NombreProducto = producto?.Nombre ?? "N/D",
                    Cantidad = item.Cantidad,
                    PrecioUnitario = item.PrecioUnitario,
                    PrecioTotal = item.PrecioTotal,
                    Detalle = item.Detalle,
                    StockActualProducto = producto?.Stock ?? 0
                });
            }

            return new
            {
                items,
                total = result.Total,
                page,
                pageSize
            };
        }

        public async Task<TransaccionResponseDto?> GetByIdAsync(long id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null) return null;

            var producto = await _productoApiClient.GetProductByIdAsync(entity.IdProducto);

            return new TransaccionResponseDto
            {
                IdTransaccionInventario = entity.IdTransaccionInventario,
                Fecha = entity.Fecha,
                TipoTransaccion = entity.TipoTransaccion,
                IdProducto = entity.IdProducto,
                NombreProducto = producto?.Nombre ?? "N/D",
                Cantidad = entity.Cantidad,
                PrecioUnitario = entity.PrecioUnitario,
                PrecioTotal = entity.PrecioTotal,
                Detalle = entity.Detalle,
                StockActualProducto = producto?.Stock ?? 0
            };
        }

        public async Task<TransaccionResponseDto> CreateAsync(TransaccionRequestDto request)
        {
            ValidarRequest(request);

            var producto = await _productoApiClient.GetProductByIdAsync(request.IdProducto);
            if (producto == null)
                throw new KeyNotFoundException("El producto no existe.");

            if (!producto.Estado)
                throw new InvalidOperationException("El producto está inactivo.");

            var tipo = request.TipoTransaccion.Trim();

            if (tipo.Equals("Venta", StringComparison.OrdinalIgnoreCase) && producto.Stock < request.Cantidad)
                throw new InvalidOperationException("No hay stock suficiente para la venta.");

            var entity = new TransaccionInventario
            {
                Fecha = DateTime.Now,
                TipoTransaccion = tipo,
                IdProducto = request.IdProducto,
                Cantidad = request.Cantidad,
                PrecioUnitario = request.PrecioUnitario,
                PrecioTotal = request.Cantidad * request.PrecioUnitario,
                Detalle = request.Detalle
            };

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            bool stockOk = tipo.Equals("Compra", StringComparison.OrdinalIgnoreCase)
                ? await _productoApiClient.IncreaseStockAsync(request.IdProducto, request.Cantidad)
                : await _productoApiClient.DecreaseStockAsync(request.IdProducto, request.Cantidad);

            if (!stockOk)
                throw new InvalidOperationException("La transacción fue registrada, pero falló el ajuste de stock.");

            var productoActualizado = await _productoApiClient.GetProductByIdAsync(request.IdProducto);

            return new TransaccionResponseDto
            {
                IdTransaccionInventario = entity.IdTransaccionInventario,
                Fecha = entity.Fecha,
                TipoTransaccion = entity.TipoTransaccion,
                IdProducto = entity.IdProducto,
                NombreProducto = productoActualizado?.Nombre ?? producto.Nombre,
                Cantidad = entity.Cantidad,
                PrecioUnitario = entity.PrecioUnitario,
                PrecioTotal = entity.PrecioTotal,
                Detalle = entity.Detalle,
                StockActualProducto = productoActualizado?.Stock ?? producto.Stock
            };
        }

        public async Task UpdateAsync(long id, TransaccionRequestDto request)
        {
            ValidarRequest(request);

            var entity = await _repository.GetByIdAsync(id);
            if (entity == null)
                throw new KeyNotFoundException("La transacción no existe.");

            entity.TipoTransaccion = request.TipoTransaccion.Trim();
            entity.IdProducto = request.IdProducto;
            entity.Cantidad = request.Cantidad;
            entity.PrecioUnitario = request.PrecioUnitario;
            entity.PrecioTotal = request.Cantidad * request.PrecioUnitario;
            entity.Detalle = request.Detalle;

            await _repository.UpdateAsync(entity);
            await _repository.SaveChangesAsync();
        }

        public async Task DeleteAsync(long id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null)
                throw new KeyNotFoundException("La transacción no existe.");

            await _repository.DeleteAsync(entity);
            await _repository.SaveChangesAsync();
        }

        private static void ValidarRequest(TransaccionRequestDto request)
        {
            if (request.IdProducto <= 0)
                throw new ArgumentException("El producto es obligatorio.");

            if (request.Cantidad <= 0)
                throw new ArgumentException("La cantidad debe ser mayor a cero.");

            if (request.PrecioUnitario < 0)
                throw new ArgumentException("El precio unitario no puede ser menor a cero.");

            if (string.IsNullOrWhiteSpace(request.TipoTransaccion))
                throw new ArgumentException("El tipo de transacción es obligatorio.");

            var tipo = request.TipoTransaccion.Trim().ToLowerInvariant();
            if (tipo != "compra" && tipo != "venta")
                throw new ArgumentException("El tipo de transacción debe ser Compra o Venta.");
        }
    }
}
