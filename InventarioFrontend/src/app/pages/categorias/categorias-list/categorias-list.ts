import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Categoria, CategoriaRequest } from '../../../core/models/categoria.model';
import { CategoriaService } from '../../../core/services/categoria-service';
import { AlertService } from '../../../core/services/alert-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categorias-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './categorias-list.html',
  styleUrl: './categorias-list.css',
})
export class CategoriasList implements OnInit {
  categorias: Categoria[] = [];
  categoriasFiltradas: Categoria[] = [];

  loading = false;
  saving = false;
  mostrarFormulario = false;
  modoEdicion = false;
  categoriaEditandoId?: number;
  busqueda = '';

  pagina = 1;
  tamanioPagina = 10;

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.cargarCategorias();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', Validators.maxLength(250)],
      estado: [true]
    });
  }

  get f(): Record<string, AbstractControl> {
    return this.form.controls;
  }

  get totalPaginas(): number {
    return Math.ceil(this.categoriasFiltradas.length / this.tamanioPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  get itemsPagina(): Categoria[] {
    const inicio = (this.pagina - 1) * this.tamanioPagina;
    return this.categoriasFiltradas.slice(inicio, inicio + this.tamanioPagina);
  }

  get desde(): number {
    if (this.categoriasFiltradas.length === 0) return 0;
    return (this.pagina - 1) * this.tamanioPagina + 1;
  }

  get hasta(): number {
    return Math.min(this.pagina * this.tamanioPagina, this.categoriasFiltradas.length);
  }

  cargarCategorias(): void {
    this.loading = true;

    this.categoriaService.getAll().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
        this.aplicarFiltro();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.alertService.error('Error', 'No se pudieron cargar las categorías');
      }
    });
  }

  aplicarFiltro(): void {
    const q = this.busqueda.toLowerCase().trim();

    this.categoriasFiltradas = q
      ? this.categorias.filter(c =>
          c.nombre.toLowerCase().includes(q) ||
          (c.descripcion ?? '').toLowerCase().includes(q)
        )
      : [...this.categorias];

    this.pagina = 1;
  }

  abrirFormulario(): void {
    this.modoEdicion = false;
    this.categoriaEditandoId = undefined;
    this.form.reset({
      nombre: '',
      descripcion: '',
      estado: true
    });
    this.mostrarFormulario = true;
  }

  editarCategoria(categoria: Categoria): void {
    this.modoEdicion = true;
    this.categoriaEditandoId = categoria.idCategoria;

    this.form.patchValue({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion ?? '',
      estado: categoria.estado
    });

    this.mostrarFormulario = true;
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.saving = false;
    this.form.reset({
      nombre: '',
      descripcion: '',
      estado: true
    });
  }

  guardar(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    this.alertService.warning('Precaución', 'Por favor complete correctamente todos los campos');
    return;
  }

  this.saving = true;

  const raw = this.form.getRawValue();

  const request: CategoriaRequest = {
    nombre: raw.nombre?.trim(),
    descripcion: raw.descripcion?.trim() || null,
    estado: !!raw.estado
  };

  const observable: Observable<unknown> =
    this.modoEdicion && this.categoriaEditandoId
      ? this.categoriaService.update(this.categoriaEditandoId, request)
      : this.categoriaService.create(request);

  observable.subscribe({
    next: () => {
      this.saving = false;
      this.mostrarFormulario = false;

      this.alertService.success(
        'Éxito',
        this.modoEdicion
          ? 'Categoría actualizada correctamente'
          : 'Categoría creada correctamente'
      );

      this.cargarCategorias();
    },
    error: (err: any) => {
      this.saving = false;
      const mensaje = err?.error?.message || 'Ocurrió un error al guardar la categoría';
      this.alertService.error('Error', mensaje);
    }
  });
}

  async confirmarEliminar(categoria: Categoria): Promise<void> {
    const ok = await this.alertService.deleteConfirm(`la categoría ${categoria.nombre}`);

    if (!ok) return;

    this.eliminar(categoria.idCategoria);
  }

  private eliminar(id: number): void {
    this.categoriaService.delete(id).subscribe({
      next: () => {
        this.alertService.toastSuccess('Categoría eliminada correctamente');
        this.cargarCategorias();
      },
      error: () => {
        this.alertService.error('Error', 'No se pudo eliminar la categoría');
      }
    });
  }

  cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.pagina = pagina;
  }
}
