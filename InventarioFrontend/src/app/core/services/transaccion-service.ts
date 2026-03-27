import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Transaccion, TransaccionFilter, TransaccionRequest } from '../models/transaccion.model';
import { Observable } from 'rxjs';
import { PagedResponse } from '../models/paged-response.model';

@Injectable({
  providedIn: 'root',
})
export class TransaccionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apis.transacciones}/transacciones`;

  getAll(filter?: TransaccionFilter): Observable<PagedResponse<Transaccion>> {
    let params = new HttpParams();

    if (filter?.idProducto !== null && filter?.idProducto !== undefined) {
      params = params.set('idProducto', filter.idProducto);
    }

    if (filter?.tipoTransaccion) {
      params = params.set('tipoTransaccion', filter.tipoTransaccion);
    }

    if (filter?.fechaInicio) {
      params = params.set('fechaInicio', filter.fechaInicio);
    }

    if (filter?.fechaFin) {
      params = params.set('fechaFin', filter.fechaFin);
    }

    params = params.set('page', filter?.page ?? 1);
    params = params.set('pageSize', filter?.pageSize ?? 10);

    return this.http.get<PagedResponse<Transaccion>>(this.baseUrl, { params });
  }

  getById(id: number): Observable<Transaccion> {
    return this.http.get<Transaccion>(`${this.baseUrl}/${id}`);
  }

  create(request: TransaccionRequest): Observable<Transaccion> {
    return this.http.post<Transaccion>(this.baseUrl, request);
  }

  update(id: number, request: TransaccionRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
