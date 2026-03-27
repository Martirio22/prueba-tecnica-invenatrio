import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { Producto, ProductoFilter } from '../../../core/models/producto.model';
import { Categoria } from '../../../core/models/categoria.model';
import { ProductoService } from '../../../core/services/producto-service';
import { CategoriaService } from '../../../core/services/categoria-service';
import { AlertService } from '../../../core/services/alert-service';

@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, MatDialogModule],
  templateUrl: './productos-list.html',
  styleUrl: './productos-list.css',
})
export class ProductosList implements OnInit {
    productos: Producto[] = [];
  categorias: Categoria[] = [];
  loading = false;

  filtro: ProductoFilter = {
    nombre: '',
    idCategoria: undefined,
    precioMin: undefined,
    precioMax: undefined,
    estado: undefined,
    page: 1,
    pageSize: 10
  };

  totalItems = 0;
  totalPaginas = 0;

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  get desde(): number {
    if (this.totalItems === 0) return 0;
    return ((this.filtro.page ?? 1) - 1) * (this.filtro.pageSize ?? 10) + 1;
  }

  get hasta(): number {
    return Math.min((this.filtro.page ?? 1) * (this.filtro.pageSize ?? 10), this.totalItems);
  }

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProductos();
  }

  cargarCategorias(): void {
    this.categoriaService.getAll().subscribe({
      next: (cats) => {
        this.categorias = cats;
      },
      error: () => {
        this.alertService.toastWarning('No se pudieron cargar las categorías');
      }
    });
  }

  cargarProductos(): void {
    this.loading = true;

    this.productoService.getAll(this.filtro).subscribe({
      next: (res) => {
        this.productos = res.items;
        this.totalItems = res.totalCount;
        this.totalPaginas = res.totalPages;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.alertService.error('Error', 'No se pudieron cargar los productos');
      }
    });
  }

  buscar(): void {
    this.filtro.page = 1;
    this.cargarProductos();
  }

  limpiarFiltros(): void {
    this.filtro = {
      nombre: '',
      idCategoria: undefined,
      precioMin: undefined,
      precioMax: undefined,
      estado: undefined,
      page: 1,
      pageSize: 10
    };

    this.cargarProductos();
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;

    this.filtro.page = pagina;
    this.cargarProductos();
  }

  async confirmarEliminar(producto: Producto): Promise<void> {
    const ok = await this.alertService.deleteConfirm(`el producto ${producto.nombre}`);

    if (!ok) return;

    this.eliminar(producto.idProducto);
  }

  private eliminar(id: number): void {
    this.productoService.delete(id).subscribe({
      next: () => {
        this.alertService.toastSuccess('Producto eliminado correctamente');
        this.cargarProductos();
      },
      error: () => {
        this.alertService.error('Error', 'No se pudo eliminar el producto');
      }
    });
  }

  nombreCategoria(idCategoria: number): string {
    return this.categorias.find(c => c.idCategoria === idCategoria)?.nombre ?? '—';
  }
}
