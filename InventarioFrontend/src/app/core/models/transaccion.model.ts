export interface Transaccion {
  idTransaccionInventario: number;
  fecha: string;
  tipoTransaccion: string;
  idProducto: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  precioTotal: number;
  detalle?: string | null;
  stockActualProducto: number;
}

export interface TransaccionRequest {
  tipoTransaccion: string;
  idProducto: number;
  cantidad: number;
  precioUnitario: number;
  detalle?: string | null;
}

export interface TransaccionFilter {
  idProducto?: number | null;
  tipoTransaccion?: string | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  page?: number;
  pageSize?: number;
}
