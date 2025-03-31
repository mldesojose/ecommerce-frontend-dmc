import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { Product } from '../shared/models/product.model';
import { HttpClient } from '@angular/common/http';
import { CreateSaleDto } from '../shared/models/createSaleDto.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSubject = new BehaviorSubject<Product[]>([]);
  private showCartSubject = new BehaviorSubject<boolean>(false);
  
  items$ = this.itemsSubject.asObservable();
  showCart$ = this.showCartSubject.asObservable();

  constructor(private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  get items(): Product[] {
    return this.itemsSubject.value;
  }

  get showCart(): boolean {
    return this.showCartSubject.value;
  }

  get itemCount(): number {
    return this.items.reduce((count, item) => count + 1, 0);
  }

  get total(): number {
    return this.items.reduce((sum, item) => sum + item.precioFinal, 0);
  }

  addItem(product: Product) {
    const currentItems = this.items;
    this.itemsSubject.next([...currentItems, product]);
    this.showCartSubject.next(true);
  }

  removeItem(product: Product) {
    const index = this.items.findIndex(p => p.idProducto === product.idProducto);
    if (index >= 0) {
      const newItems = [...this.items];
      newItems.splice(index, 1);
      this.itemsSubject.next(newItems);
    }
  }

  toggleCart() {
    this.showCartSubject.next(!this.showCart);
  }
  checkout(
    userId: number,
    observation: string = '',
    userData: { usuario: string; terminal: string }
  ) {
    if (this.items.length === 0) {
      throw new Error('El carrito está vacío');
    }

    // Transformar los productos a CreateSaleDto[]
    const saleItems: CreateSaleDto[] = this.items.map(product => ({
      idUsuario: userId,
      idProducto: product.idProducto,
      montoVenta: this.total, // Monto total de toda la venta
      observacion: observation,
      precio: product.precio,
      porcentajeOferta: product.porcentajeOferta,
      precioFinal: product.precioFinal,
      activo: true, // Por defecto activo
      usuarioCreacion: userData.usuario,
      terminalCreacion: userData.terminal
    }));

    // Enviar al backend
    return this.http.post(`http://localhost:3000/api/sales`, saleItems).pipe(
      tap(() => {
        this.snackBar.open('¡Compra realizada con éxito!', 'Cerrar', {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
        this.clearCart();
      }),
      catchError(error => {
        this.snackBar.open('Error al procesar la compra', 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        return throwError(() => error);
      })
    );
    //return this.http.post(`${environment.apiUrl}/sales`, saleItems);
  }

  /**
   * Limpia el carrito después de una compra exitosa
   */
  clearCart() {
    this.itemsSubject.next([]);
    this.showCartSubject.next(false);
  }
}