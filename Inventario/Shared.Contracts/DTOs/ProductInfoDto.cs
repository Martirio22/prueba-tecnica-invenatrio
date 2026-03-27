namespace Shared.Contracts.DTOs
{
    public class ProductInfoDto
    {
        public int IdProducto { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public int Stock { get; set; }
        public decimal Precio { get; set; }
        public bool Estado { get; set; }
    }
}
