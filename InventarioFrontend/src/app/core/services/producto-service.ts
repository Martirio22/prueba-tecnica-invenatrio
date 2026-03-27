import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AjusteStockRequest, Producto, ProductoFilter, ProductoRequest } from '../models/producto.model';
import { Observable } from 'rxjs';
import { PagedResponse } from '../models/paged-response.model';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apis.inventario}/productos`;

  getAll(filter?: ProductoFilter): Observable<PagedResponse<Producto>> {
    let params = new HttpParams();

    if (filter?.nombre) {
      params = params.set('nombre', filter.nombre);
    }

    if (filter?.idCategoria !== null && filter?.idCategoria !== undefined) {
      params = params.set('idCategoria', filter.idCategoria);
    }

    if (filter?.estado !== null && filter?.estado !== undefined) {
      params = params.set('estado', filter.estado);
    }

    if (filter?.precioMin !== null && filter?.precioMin !== undefined) {
      params = params.set('precioMin', filter.precioMin);
    }

    if (filter?.precioMax !== null && filter?.precioMax !== undefined) {
      params = params.set('precioMax', filter.precioMax);
    }

    params = params.set('page', filter?.page ?? 1);
    params = params.set('pageSize', filter?.pageSize ?? 10);

    return this.http.get<PagedResponse<Producto>>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/${id}`);
  }

  create(request: ProductoRequest): Observable<Producto> {
    return this.http.post<Producto>(this.baseUrl, request);
  }

  update(id: number, request: ProductoRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  adjustStock(id: number, request: AjusteStockRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/stock/ajustar`, request);
  }

  uploadImage(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ imageUrl: string }>(
      `${this.baseUrl}/upload-image`,
      formData
    );
  }
}
