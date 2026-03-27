export interface Categoria {
  idCategoria: number;
  nombre: string;
  descripcion?: string | null;
  estado: boolean;
  fechaCreacion: string;
}

export interface CategoriaRequest {
  nombre: string;
  descripcion?: string | null;
  estado: boolean;
}
