import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SaleEntity } from '../shared/entities/sale.entity';
import { PaginatedResult } from '../shared/models/paginated-result.model';
import { DetSaleEntity } from '../shared/entities/detsale.entity';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
    private apiUrl = `http://localhost:3000/api/sales`;

  constructor(private http: HttpClient) { }

  // Obtener todas las ventas
  getAllSales(): Observable<SaleEntity[]> {
    return this.http.get<SaleEntity[]>(this.apiUrl);
  }

  // Obtener ventas paginadas
  getSalesPaginated(page: number, pageSize: number, searchTerm?: string): Observable<PaginatedResult<SaleEntity>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<PaginatedResult<SaleEntity>>(`${this.apiUrl}/paginated`, { params });
  }

  // Obtener una venta por ID
  getSaleById(id: number): Observable<SaleEntity> {
    return this.http.get<SaleEntity>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva venta
  createSale(sale: SaleEntity): Observable<SaleEntity> {
    return this.http.post<SaleEntity>(this.apiUrl, sale);
  }

  // Actualizar una venta existente
  updateSale(id: number, sale: SaleEntity): Observable<SaleEntity> {
    return this.http.put<SaleEntity>(`${this.apiUrl}/${id}`, sale);
  }

  // Eliminar una venta
  deleteSale(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Cambiar el estado activo/inactivo de una venta
  updateSaleStatus(id: number, active: boolean): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status`, { activo: active });
  }

  // Método adicional para obtener estadísticas de ventas
  getSalesStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistics`);
  }

  getSaleDetails(id: number): Observable<DetSaleEntity[]> {
    return this.http.get<DetSaleEntity[]>(`${this.apiUrl}/detalle/${id}`);
  }
}