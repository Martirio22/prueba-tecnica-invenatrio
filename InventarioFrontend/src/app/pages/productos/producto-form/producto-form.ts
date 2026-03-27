import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Categoria } from '../../../core/models/categoria.model';
import { ProductoService } from '../../../core/services/producto-service';
import { CategoriaService } from '../../../core/services/categoria-service';
import { AlertService } from '../../../core/services/alert-service';
import { ProductoRequest } from '../../../core/models/producto.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css',
})
export class ProductoForm implements OnInit {
  form!: FormGroup;
  categorias: Categoria[] = [];
  loading = false;
  saving = false;
  modoEdicion = false;
  productoId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.buildForm();

    this.productoId = Number(this.route.snapshot.paramMap.get('id')) || undefined;
    if (this.productoId) {
      this.modoEdicion = true;
    }

    this.cargarCategorias();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(150)]],
      descripcion: ['', Validators.maxLength(500)],
      idCategoria: [null, Validators.required],
      imagenUrl: ['', Validators.maxLength(500)],
      precio: [null, [Validators.required, Validators.min(0)]],
      stock: [null, [Validators.required, Validators.min(0)]],
      estado: [true]
    });
  }

  cargarCategorias(): void {
    this.loading = true;

    this.categoriaService.getAll().subscribe({
      next: (categorias) => {
        this.categorias = categorias;

        if (this.modoEdicion && this.productoId) {
          this.cargarProducto(this.productoId);
        } else {
          this.loading = false;
        }
      },
      error: () => {
        this.loading = false;
        this.alertService.error('Error', 'No se pudieron cargar las categorías');
      }
    });
  }

  cargarProducto(id: number): void {
    this.loading = true;

    this.productoService.getById(id).subscribe({
      next: (producto) => {
        this.form.patchValue({
          nombre: producto.nombre,
          descripcion: producto.descripcion ?? '',
          idCategoria: producto.idCategoria,
          imagenUrl: producto.imagenUrl ?? '',
          precio: producto.precio,
          stock: producto.stock,
          estado: producto.estado
        });

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.alertService.error('Error', 'No se pudo cargar el producto');
        this.router.navigate(['/productos']);
      }
    });
  }

  get f(): Record<string, AbstractControl> {
    return this.form.controls;
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alertService.warning('Precaución', 'Por favor complete correctamente los campos requeridos');
      return;
    }

    this.saving = true;

    const raw = this.form.getRawValue();

    const request: ProductoRequest = {
      nombre: raw.nombre?.trim(),
      descripcion: raw.descripcion?.trim() || null,
      idCategoria: Number(raw.idCategoria),
      imagenUrl: raw.imagenUrl?.trim() || null,
      precio: Number(raw.precio),
      stock: Number(raw.stock),
      estado: !!raw.estado
    };

    const observable: Observable<unknown> =
      this.modoEdicion && this.productoId
        ? this.productoService.update(this.productoId, request)
        : this.productoService.create(request);

    observable.subscribe({
      next: () => {
        this.saving = false;
        this.alertService.success(
          'Éxito',
          this.modoEdicion
            ? 'Producto actualizado correctamente'
            : 'Producto creado correctamente'
        );
        this.router.navigate(['/productos']);
      },
      error: (err: any) => {
        this.saving = false;
        const mensaje = err?.error?.message || 'Ocurrió un error al guardar el producto';
        this.alertService.error('Error', mensaje);
      }
    });
  }
}
