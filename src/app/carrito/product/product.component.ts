import { Component, Input, Output, EventEmitter, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Product } from '../../shared/models/product.model';

@Pipe({
  name: 'shorttext',
  standalone: true,
})
export class ShortTextPipe implements PipeTransform {
  transform(value: string) {
    return `${value.substring(0, 50)}...`;
  }
}
@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule,    ShortTextPipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
}