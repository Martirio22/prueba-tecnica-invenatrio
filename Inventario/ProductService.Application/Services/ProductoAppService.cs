using ProductService.Application.DTOs;
using ProductService.Application.Interfaces;
using ProductService.Domain.Entities;

namespace ProductService.Application.Services
{
    public class ProductoAppService : IProductoAppService
    {
        private readonly IProductoRepository _productoRepository;
        private readonly ICategoriaRepository _categoriaRepository;
        private readonly string _uploadRoot;

        public ProductoAppService(
            IProductoRepository productoRepository,
            ICategoriaRepository categoriaRepository,
            string uploadRoot)
        {
            _productoRepository = productoRepository;
            _categoriaRepository = categoriaRepository;
            _uploadRoot = uploadRoot;
        }

        public async Task<ProductoResponseDto?> GetByIdAsync(int id)
        {
            var entity = await _productoRepository.GetByIdAsync(id);
            return entity == null ? null : Map(entity);
        }

        public async Task<object> GetPagedAsync(
            string? nombre,
            int? idCategoria,
            bool? estado,
            decimal? precioMin,
            decimal? precioMax,
            int page,
            int pageSize)
        {
            var result = await _productoRepository.GetPagedAsync(
                nombre, idCategoria, estado, precioMin, precioMax, page, pageSize);

            return new
            {
                items = result.Items.Select(Map),
                total = result.Total,
                page,
                pageSize
            };
        }

        public async Task<ProductoResponseDto> CreateAsync(ProductoRequestDto request)
        {
            await ValidarProductoAsync(request);

            var entity = new Producto
            {
                Nombre = request.Nombre.Trim(),
                Descripcion = request.Descripcion,
                IdCategoria = request.IdCategoria,
                ImagenUrl = request.ImagenUrl,
                Precio = request.Precio,
                Stock = request.Stock,
                Estado = request.Estado,
                FechaCreacion = DateTime.UtcNow
            };

            await _productoRepository.AddAsync(entity);
            await _productoRepository.SaveChangesAsync();

            var creado = await _productoRepository.GetByIdAsync(entity.IdProducto);
            return Map(creado!);
        }

        public async Task UpdateAsync(int id, ProductoRequestDto request)
        {
            await ValidarProductoAsync(request);

            var entity = await _productoRepository.GetByIdAsync(id);
            if (entity == null)
                throw new KeyNotFoundException("El producto no existe.");

            entity.Nombre = request.Nombre.Trim();
            entity.Descripcion = request.Descripcion;
            entity.IdCategoria = request.IdCategoria;
            entity.ImagenUrl = request.ImagenUrl;
            entity.Precio = request.Precio;
            entity.Stock = request.Stock;
            entity.Estado = request.Estado;

            await _productoRepository.UpdateAsync(entity);
            await _productoRepository.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _productoRepository.GetByIdAsync(id);
            if (entity == null)
                throw new KeyNotFoundException("El producto no existe.");

            entity.Estado = false;
            await _productoRepository.UpdateAsync(entity);
            await _productoRepository.SaveChangesAsync();
        }

        public async Task AdjustStockAsync(int id, AjusteStockRequestDto request)
        {
            var entity = await _productoRepository.GetByIdAsync(id);
            if (entity == null)
                throw new KeyNotFoundException("Producto no encontrado.");

            if (request.Cantidad <= 0)
                throw new ArgumentException("La cantidad debe ser mayor a cero.");

            var operacion = request.Operacion.Trim().ToLowerInvariant();

            if (operacion == "sumar")
            {
                entity.Stock += request.Cantidad;
            }
            else if (operacion == "restar")
            {
                if (entity.Stock < request.Cantidad)
                    throw new InvalidOperationException("Stock insuficiente.");

                entity.Stock -= request.Cantidad;
            }
            else
            {
                throw new ArgumentException("La operación debe ser 'sumar' o 'restar'.");
            }

            await _productoRepository.UpdateAsync(entity);
            await _productoRepository.SaveChangesAsync();
        }

        public async Task<string> SaveImageAsync(Stream fileStream, string fileName)
        {
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp" };

            if (!allowed.Contains(extension))
                throw new ArgumentException("Formato de imagen no permitido.");

            Directory.CreateDirectory(_uploadRoot);

            var newFileName = $"{Guid.NewGuid()}{extension}";
            var fullPath = Path.Combine(_uploadRoot, newFileName);

            using var output = new FileStream(fullPath, FileMode.Create);
            await fileStream.CopyToAsync(output);

            return $"/uploads/productos/{newFileName}";
        }

        private async Task ValidarProductoAsync(ProductoRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Nombre))
                throw new ArgumentException("El nombre del producto es obligatorio.");

            if (request.IdCategoria <= 0)
                throw new ArgumentException("La categoría es obligatoria.");

            if (request.Precio < 0)
                throw new ArgumentException("El precio no puede ser menor a cero.");

            if (request.Stock < 0)
                throw new ArgumentException("El stock no puede ser menor a cero.");

            var categoria = await _categoriaRepository.GetByIdAsync(request.IdCategoria);
            if (categoria == null)
                throw new KeyNotFoundException("La categoría no existe.");
        }

        private static ProductoResponseDto Map(Producto entity)
        {
            return new ProductoResponseDto
            {
                IdProducto = entity.IdProducto,
                Nombre = entity.Nombre,
                Descripcion = entity.Descripcion,
                IdCategoria = entity.IdCategoria,
                CategoriaNombre = entity.Categoria?.Nombre,
                ImagenUrl = entity.ImagenUrl,
                Precio = entity.Precio,
                Stock = entity.Stock,
                Estado = entity.Estado,
                FechaCreacion = entity.FechaCreacion
            };
        }
    }
}
