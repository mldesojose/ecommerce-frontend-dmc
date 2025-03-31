import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from '../cart/cart.component';
import { ProductListComponent } from '../product-list/product-list.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, CartComponent, ProductListComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent {}