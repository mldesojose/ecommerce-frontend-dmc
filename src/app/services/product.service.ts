import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductEntity } from '../shared/entities/product.entity';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `http://localhost:3000/api/products`;  

  constructor(private http: HttpClient) { }

  getProducts(): Observable<ProductEntity[]> {
    return this.http.get<ProductEntity[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<ProductEntity> {
    return this.http.get<ProductEntity>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: ProductEntity): Observable<ProductEntity> {
    return this.http.post<ProductEntity>(this.apiUrl, product);
  }

  updateProduct(id: number, product: ProductEntity): Observable<ProductEntity> {
    return this.http.patch<ProductEntity>(`${this.apiUrl}/${id}`, product);
  }   

  deleteProduct(id: number, usuario: string, terminal: string): Observable<any> {
    // Limpia los parámetros
    terminal = terminal.trim();
    usuario = usuario.trim();
    
    return this.http.delete(`${this.apiUrl}/${id}`, {
      params: { usuario, terminal }
    });
  }

  updateProductState(id: number, activo: boolean): Observable<ProductEntity> {
    return this.http.patch<ProductEntity>(`${this.apiUrl}/${id}/state`, { activo });
  }
}