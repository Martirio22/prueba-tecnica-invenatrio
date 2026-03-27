import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Producto } from '../../../core/models/producto.model';
import { TransaccionService } from '../../../core/services/transaccion-service';
import { ProductoService } from '../../../core/services/producto-service';
import { AlertService } from '../../../core/services/alert-service';
import { TransaccionRequest } from '../../../core/models/transaccion.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-transaccion-form',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './transaccion-form.html',
  styleUrl: './transaccion-form.css',
})
export class TransaccionForm implements OnInit {
  form!: FormGroup;
  productos: Producto[] = [];
  productoSeleccionado?: Producto;

  loading = false;
  saving = false;
  modoEdicion = false;
  transaccionId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private transaccionService: TransaccionService,
    private productoService: ProductoService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.buildForm();

    this.transaccionId = Number(this.route.snapshot.paramMap.get('id')) || undefined;
    if (this.transaccionId) {
      this.modoEdicion = true;
    }

    this.configurarEventosFormulario();
    this.cargarProductos();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      idProducto: [null, Validators.required],
      tipoTransaccion: ['Compra', Validators.required],
      cantidad: [null, [Validators.required, Validators.min(1)]],
      precioUnitario: [null, [Validators.required, Validators.min(0)]],
      precioTotal: [{ value: 0, disabled: true }],
      detalle: ['', Validators.maxLength(500)]
    });
  }

  private configurarEventosFormulario(): void {
    this.form.get('cantidad')?.valueChanges.subscribe(() => {
      this.calcularTotal();
      this.validarStockVenta();
    });

    this.form.get('precioUnitario')?.valueChanges.subscribe(() => {
      this.calcularTotal();
    });

    this.form.get('idProducto')?.valueChanges.subscribe((id) => {
      this.productoSeleccionado = this.productos.find(p => p.idProducto === Number(id));
      this.validarStockVenta();
    });

    this.form.get('tipoTransaccion')?.valueChanges.subscribe(() => {
      this.validarStockVenta();
    });
  }

  cargarProductos(): void {
    this.loading = true;

    this.productoService.getAll({
      page: 1,
      pageSize: 1000,
      estado: true
    }).subscribe({
      next: (res) => {
        this.productos = res.items;

        if (this.modoEdicion && this.transaccionId) {
          this.cargarTransaccion(this.transaccionId);
        } else {
          this.loading = false;
        }
      },
      error: () => {
        this.loading = false;
        this.alertService.error('Error', 'No se pudieron cargar los productos');
      }
    });
  }

  cargarTransaccion(id: number): void {
    this.loading = true;

    this.transaccionService.getById(id).subscribe({
      next: (t) => {
        this.form.patchValue({
          idProducto: t.idProducto,
          tipoTransaccion: t.tipoTransaccion,
          cantidad: t.cantidad,
          precioUnitario: t.precioUnitario,
          detalle: t.detalle ?? ''
        });

        this.productoSeleccionado = this.productos.find(p => p.idProducto === t.idProducto);
        this.calcularTotal();
        this.validarStockVenta();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.alertService.error('Error', 'No se pudo cargar la transacción');
        this.router.navigate(['/transacciones']);
      }
    });
  }

  get f(): Record<string, AbstractControl> {
    return this.form.controls;
  }

  calcularTotal(): void {
    const cantidad = Number(this.form.get('cantidad')?.value) || 0;
    const precioUnitario = Number(this.form.get('precioUnitario')?.value) || 0;
    const total = cantidad * precioUnitario;

    this.form.get('precioTotal')?.setValue(total.toFixed(2), { emitEvent: false });
  }

  validarStockVenta(): void {
    const controlCantidad = this.form.get('cantidad');
    const tipo = this.form.get('tipoTransaccion')?.value;
    const cantidad = Number(controlCantidad?.value) || 0;

    if (!controlCantidad) return;

    const erroresActuales = controlCantidad.errors ?? {};

    if (tipo === 'Venta' && this.productoSeleccionado && cantidad > this.productoSeleccionado.stock) {
      controlCantidad.setErrors({
        ...erroresActuales,
        stockInsuficiente: true
      });
      return;
    }

    if (erroresActuales['stockInsuficiente']) {
      delete erroresActuales['stockInsuficiente'];
      const tieneOtrosErrores = Object.keys(erroresActuales).length > 0;
      controlCantidad.setErrors(tieneOtrosErrores ? erroresActuales : null);
    }
  }

  guardar(): void {
    this.validarStockVenta();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alertService.warning('Precaución', 'Por favor complete correctamente los campos requeridos');
      return;
    }

    this.saving = true;

    const raw = this.form.getRawValue();

    const request: TransaccionRequest = {
      tipoTransaccion: raw.tipoTransaccion,
      idProducto: Number(raw.idProducto),
      cantidad: Number(raw.cantidad),
      precioUnitario: Number(raw.precioUnitario),
      detalle: raw.detalle?.trim() || null
    };

    const observable: Observable<unknown> =
      this.modoEdicion && this.transaccionId
        ? this.transaccionService.update(this.transaccionId, request)
        : this.transaccionService.create(request);

    observable.subscribe({
      next: () => {
        this.saving = false;
        this.alertService.success(
          'Éxito',
          this.modoEdicion
            ? 'Transacción actualizada correctamente'
            : 'Transacción registrada correctamente'
        );
        this.router.navigate(['/transacciones']);
      },
      error: (err: any) => {
        this.saving = false;
        const mensaje = err?.error?.message || 'Ocurrió un error al guardar la transacción';
        this.alertService.error('Error', mensaje);
      }
    });
  }
}
