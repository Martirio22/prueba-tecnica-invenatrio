export interface Producto {
  idProducto: number;
  nombre: string;
  descripcion?: string | null;
  idCategoria: number;
  categoriaNombre?: string | null;
  imagenUrl?: string | null;
  precio: number;
  stock: number;
  estado: boolean;
  fechaCreacion: string;
}

export interface ProductoRequest {
  nombre: string;
  descripcion?: string | null;
  idCategoria: number;
  imagenUrl?: string | null;
  precio: number;
  stock: number;
  estado: boolean;
}

export interface AjusteStockRequest {
  cantidad: number;
  operacion: string;
}

export interface ProductoFilter {
  nombre?: string | null;
  idCategoria?: number | null;
  estado?: boolean | null;
  precioMin?: number | null;
  precioMax?: number | null;
  page?: number;
  pageSize?: number;
}
