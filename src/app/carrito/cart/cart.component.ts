import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { CartService } from '../../services/cart.service';
import { StorageService } from '../../services/storage.service';
import { AuditoriaService } from '../../services/auditoria.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule, MatIconModule, MatBadgeModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  constructor(
              public cartService: CartService,
              private  storageService:StorageService,  
              private  auditoriaService: AuditoriaService,              
  ) {}

  checkout() {
    console.log('Procesando compra...');

    let terminal: string = ' 127.0.0.10';
      this.onTerminal().subscribe(ip => {        
        terminal = ip;
      });

    // Aquí puedes implementar la lógica de compra
    const userId = this.storageService.obtenerUserId; // Obtener esto de tu servicio de autenticación
    const userData = {
      usuario: this.storageService.obtenerUsuario,
      terminal: terminal
    };

    this.cartService.checkout(userId, 'Compra realizada', userData).subscribe({
      next: (response) => {
        console.log('Compra exitosa', response);
        this.cartService.clearCart();
        // Redirigir o mostrar mensaje de éxito
      },
      error: (err) => {
        console.error('Error en la compra', err);
        // Mostrar mensaje de error
      }
    });


    // Ejemplo: this.cartService.checkout();
  }

    onTerminal(): Observable<string> {
      return this.auditoriaService.obtenerTerminal();
    }
} 