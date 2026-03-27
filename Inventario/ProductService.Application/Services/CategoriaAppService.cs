using ProductService.Application.DTOs;
using ProductService.Application.Interfaces;
using ProductService.Domain.Entities;

namespace ProductService.Application.Services
{
    public class CategoriaAppService : ICategoriaAppService
    {
        private readonly ICategoriaRepository _repository;

        public CategoriaAppService(ICategoriaRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<CategoriaResponseDto>> GetAllAsync()
        {
            var items = await _repository.GetAllAsync();

            return items.Select(x => new CategoriaResponseDto
            {
                IdCategoria = x.IdCategoria,
                Nombre = x.Nombre,
                Descripcion = x.Descripcion,
                Estado = x.Estado,
                FechaCreacion = x.FechaCreacion
            });
        }

        public async Task<CategoriaResponseDto?> GetByIdAsync(int id)
        {
            var item = await _repository.GetByIdAsync(id);
            if (item == null) return null;

            return new CategoriaResponseDto
            {
                IdCategoria = item.IdCategoria,
                Nombre = item.Nombre,
                Descripcion = item.Descripcion,
                Estado = item.Estado,
                FechaCreacion = item.FechaCreacion
            };
        }

        public async Task<CategoriaResponseDto> CreateAsync(CategoriaRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Nombre))
                throw new ArgumentException("El nombre de la categoría es obligatorio.");

            var entity = new Categoria
            {
                Nombre = request.Nombre.Trim(),
                Descripcion = request.Descripcion,
                Estado = request.Estado
            };

            await _repository.AddAsync(entity);
            await _repository.SaveChangesAsync();

            return new CategoriaResponseDto
            {
                IdCategoria = entity.IdCategoria,
                Nombre = entity.Nombre,
                Descripcion = entity.Descripcion,
                Estado = entity.Estado,
                FechaCreacion = entity.FechaCreacion
            };
        }

        public async Task UpdateAsync(int id, CategoriaRequestDto request)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null)
                throw new KeyNotFoundException("La categoría no existe.");

            if (string.IsNullOrWhiteSpace(request.Nombre))
                throw new ArgumentException("El nombre de la categoría es obligatorio.");

            entity.Nombre = request.Nombre.Trim();
            entity.Descripcion = request.Descripcion;
            entity.Estado = request.Estado;

            await _repository.UpdateAsync(entity);
            await _repository.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null)
                throw new KeyNotFoundException("La categoría no existe.");

            entity.Estado = false;
            await _repository.UpdateAsync(entity);
            await _repository.SaveChangesAsync();
        }
    }
}
