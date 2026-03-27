namespace TransactionService.Application.DTOs
{
    public class TransaccionRequestDto
    {
        public string TipoTransaccion { get; set; } = string.Empty;
        public int IdProducto { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public string? Detalle { get; set; }
    }
}
