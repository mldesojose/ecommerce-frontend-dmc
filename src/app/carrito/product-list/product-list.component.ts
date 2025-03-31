import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from '../product/product.component';
import { Product } from '../../shared/models/product.model';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { ProductEntity } from '../../shared/entities/product.entity';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products?: Observable<ProductEntity[]>;  
  constructor(private readonly productoService: ProductService,
            private cartService: CartService) {}

   async ngOnInit() {

    console.log("prueba 01" ) 
  
   this.products = await this.productoService.getProducts();
   console.log("prueba 02" )            


   
   

  }         


   
  addToCart(product: Product) {
    this.cartService.addItem(product);
  }
}