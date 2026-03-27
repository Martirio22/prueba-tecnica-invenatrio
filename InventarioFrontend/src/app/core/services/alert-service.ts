import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private loadingOpen = false;

  success(title = 'Éxito', text = 'Operación realizada correctamente'): Promise<SweetAlertResult<any>> {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#2563eb'
    });
  }

  error(title = 'Error', text = 'Ocurrió un error inesperado'): Promise<SweetAlertResult<any>> {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#dc2626'
    });
  }

  warning(title = 'Precaución', text = 'Revisa la información ingresada'): Promise<SweetAlertResult<any>> {
    return Swal.fire({
      icon: 'warning',
      title,
      text,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#f59e0b'
    });
  }

  info(title = 'Información', text = ''): Promise<SweetAlertResult<any>> {
    return Swal.fire({
      icon: 'info',
      title,
      text,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#2563eb'
    });
  }

  question(title = 'Confirmación', text = ''): Promise<SweetAlertResult<any>> {
    return Swal.fire({
      icon: 'question',
      title,
      text,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#2563eb'
    });
  }

  confirm(
    title = '¿Estás seguro?',
    text = 'Esta acción no se puede deshacer',
    confirmButtonText = 'Sí, continuar',
    cancelButtonText = 'Cancelar',
    icon: SweetAlertIcon = 'warning'
  ): Promise<boolean> {
    return Swal.fire({
      icon,
      title,
      text,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
      focusCancel: true
    }).then((result) => result.isConfirmed);
  }

  deleteConfirm(itemName = 'este registro'): Promise<boolean> {
    return Swal.fire({
      icon: 'warning',
      title: '¿Eliminar registro?',
      text: `Se eliminará ${itemName}. Esta acción no se puede deshacer.`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
      focusCancel: true
    }).then((result) => result.isConfirmed);
  }

  async prompt(
    title = 'Ingrese un valor',
    inputLabel = 'Valor',
    inputValue = ''
  ): Promise<string | null> {
    const result = await Swal.fire({
      title,
      input: 'text',
      inputLabel,
      inputValue,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      reverseButtons: true,
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return 'Este campo es obligatorio';
        }
        return null;
      }
    });

    return result.isConfirmed ? result.value : null;
  }

  loading(title = 'Cargando...', text = 'Por favor espera'): void {
    this.loadingOpen = true;

    Swal.fire({
      title,
      text,
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  close(): void {
    if (this.loadingOpen || Swal.isVisible()) {
      Swal.close();
    }
    this.loadingOpen = false;
  }

  toastSuccess(title = 'Operación realizada correctamente'): void {
    void Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true
    });
  }

  toastError(title = 'Ocurrió un error'): void {
    void Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }

  toastWarning(title = 'Precaución'): void {
    void Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'warning',
      title,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }

  toastInfo(title = 'Información'): void {
    void Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true
    });
  }
}
