using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProductService.Domain.Entities;

namespace ProductService.Infrastructure.Persistence.Configurations
{
    public class ProductoConfiguration : IEntityTypeConfiguration<Producto>
    {
        public void Configure(EntityTypeBuilder<Producto> builder)
        {
            builder.ToTable("Producto");

            builder.HasKey(x => x.IdProducto);

            builder.Property(x => x.IdProducto)
                .ValueGeneratedOnAdd();

            builder.Property(x => x.Nombre)
                .HasMaxLength(150)
                .IsRequired();

            builder.Property(x => x.Descripcion)
                .HasMaxLength(500);

            builder.Property(x => x.ImagenUrl)
                .HasMaxLength(500);

            builder.Property(x => x.Precio)
                .HasColumnType("decimal(18,2)")
                .IsRequired();

            builder.Property(x => x.Stock)
                .IsRequired();

            builder.Property(x => x.Estado)
                .IsRequired();

            builder.Property(x => x.FechaCreacion)
                .IsRequired();

            builder.HasOne(x => x.Categoria)
                .WithMany(x => x.Productos)
                .HasForeignKey(x => x.IdCategoria);
        }
    }
}
