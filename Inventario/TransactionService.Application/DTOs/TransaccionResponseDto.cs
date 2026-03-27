namespace TransactionService.Application.DTOs
{
    public class TransaccionResponseDto
    {
        public long IdTransaccionInventario { get; set; }
        public DateTime Fecha { get; set; }
        public string TipoTransaccion { get; set; } = string.Empty;
        public int IdProducto { get; set; }
        public string NombreProducto { get; set; } = string.Empty;
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal PrecioTotal { get; set; }
        public string? Detalle { get; set; }
        public int StockActualProducto { get; set; }
    }
}
