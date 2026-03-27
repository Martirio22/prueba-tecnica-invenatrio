using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProductService.Infrastructure.Persistence;

namespace ProductService.API.Controllers
{
    [ApiController]
    [Route("api/test-db")]
    public class TestDbController : ControllerBase
    {
        private readonly ProductDbContext _context;

        public TestDbController(ProductDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var totalCategorias = _context.Categorias.Count();
            var totalProductos = _context.Productos.Count();

            return Ok(new
            {
                conectado = true,
                totalCategorias,
                totalProductos
            });
        }
    }
}
