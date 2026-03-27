namespace ProductService.Application.DTOs
{
    public class AjusteStockRequestDto
    {
        public int Cantidad { get; set; }
        public string Operacion { get; set; } = string.Empty;
    }
}
