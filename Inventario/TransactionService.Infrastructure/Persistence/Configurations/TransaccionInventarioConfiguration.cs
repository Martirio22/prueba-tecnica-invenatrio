using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TransactionService.Domain.Entities;

namespace TransactionService.Infrastructure.Persistence.Configurations
{
    public class TransaccionInventarioConfiguration : IEntityTypeConfiguration<TransaccionInventario>
    {
        public void Configure(EntityTypeBuilder<TransaccionInventario> builder)
        {
            builder.ToTable("TransaccionInventario");

            builder.HasKey(x => x.IdTransaccionInventario);

            builder.Property(x => x.IdTransaccionInventario)
                .ValueGeneratedOnAdd();

            builder.Property(x => x.Fecha).IsRequired();

            builder.Property(x => x.TipoTransaccion)
                .HasMaxLength(20)
                .IsRequired();

            builder.Property(x => x.IdProducto).IsRequired();
            builder.Property(x => x.Cantidad).IsRequired();

            builder.Property(x => x.PrecioUnitario)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            builder.Property(x => x.PrecioTotal)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            builder.Property(x => x.Detalle)
                .HasMaxLength(500);
        }
    }
}
