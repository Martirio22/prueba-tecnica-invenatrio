import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Transaccion, TransaccionFilter } from '../../../core/models/transaccion.model';
import { Producto } from '../../../core/models/producto.model';
import { TransaccionService } from '../../../core/services/transaccion-service';
import { ProductoService } from '../../../core/services/producto-service';
import { AlertService } from '../../../core/services/alert-service';

@Component({
  selector: 'app-transacciones-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './transacciones-list.html',
  styleUrl: './transacciones-list.css',
})
export class TransaccionesList implements OnInit {
  transacciones: Transaccion[] = [];
  productos: Producto[] = [];
  loading = false;

  filtro: TransaccionFilter = {
    idProducto: undefined,
    tipoTransaccion: '',
    fechaInicio: '',
    fechaFin: '',
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
    private transaccionService: TransaccionService,
    private productoService: ProductoService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarTransacciones();
  }

  cargarProductos(): void {
    this.productoService.getAll({
      page: 1,
      pageSize: 1000,
      estado: true
    }).subscribe({
      next: (res) => {
        this.productos = res.items;
      },
      error: () => {
        this.alertService.toastWarning('No se pudieron cargar los productos');
      }
    });
  }

  cargarTransacciones(): void {
    this.loading = true;

    this.transaccionService.getAll(this.filtro).subscribe({
      next: (res) => {
        this.transacciones = res.items;
        this.totalItems = res.totalCount;
        this.totalPaginas = res.totalPages;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.alertService.error('Error', 'No se pudieron cargar las transacciones');
      }
    });
  }

  buscar(): void {
    this.filtro.page = 1;
    this.cargarTransacciones();
  }

  limpiarFiltros(): void {
    this.filtro = {
      idProducto: undefined,
      tipoTransaccion: '',
      fechaInicio: '',
      fechaFin: '',
      page: 1,
      pageSize: 10
    };

    this.cargarTransacciones();
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;

    this.filtro.page = pagina;
    this.cargarTransacciones();
  }

  async confirmarEliminar(t: Transaccion): Promise<void> {
    const ok = await this.alertService.deleteConfirm(`la transacción #${t.idTransaccionInventario}`);

    if (!ok) return;

    this.eliminar(t.idTransaccionInventario);
  }

  private eliminar(id: number): void {
    this.transaccionService.delete(id).subscribe({
      next: () => {
        this.alertService.toastSuccess('Transacción eliminada correctamente');
        this.cargarTransacciones();
      },
      error: () => {
        this.alertService.error('Error', 'No se pudo eliminar la transacción');
      }
    });
  }
}
