import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { ProductEntity } from '../shared/entities/product.entity';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { AuditoriaService } from '../services/auditoria.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-show-products',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule ,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './show-products.component.html',
  styleUrls: ['./show-products.component.css']
})
export class ShowProductsComponent implements OnInit {
  displayedColumns: string[] = ['idProducto', 'nomProducto', 'descripcion', 'precio', 'isOferta', 'porcentajeOferta', 'precioFinal', 'activo', 'acciones'];
  dataSource!: MatTableDataSource<ProductEntity> ;

  @ViewChild(MatPaginator) paginator!: MatPaginator ;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(
    private productService: ProductService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private auditoriaService: AuditoriaService,
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  onTerminal(): Observable<string> {
    return this.auditoriaService.obtenerTerminal();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.dataSource = new MatTableDataSource(products);
        this.dataSource.paginator = this.paginator;
       // this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.showSnackBar('Error al cargar productos');
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

   
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  openAddDialog(): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '600px',
      data: { mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.productService.createProduct(result).subscribe({
          next: () => {
            this.showSnackBar('Producto creado correctamente');
            this.loadProducts();
          },
          error: (err) => {
            console.error('Error creating product', err);
            this.showSnackBar('Error al crear producto');
          }
        });        
      }
    });
  }

  openEditDialog(product: ProductEntity): void {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '600px',
      data: { mode: 'edit', product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.updateProduct(product.idProducto, result).subscribe({
          next: () => {
            this.showSnackBar('Producto actualizado correctamente');
            this.loadProducts();
          },
          error: (err) => {
            console.error('Error updating product', err);
            this.showSnackBar('Error al actualizar producto');
          }
        });
      }
    });
  }

  deleteProduct(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title: 'Confirmar', message: '¿Estás seguro de eliminar este producto?' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let terminal = '127.0.0.10'; // Sin espacio inicial
        this.onTerminal().subscribe(ip => {        
          terminal = ip.trim();
        });
        const usuario = this.auditoriaService.obtenerUsuario.toString().trim();
  
        this.productService.deleteProduct(id, usuario, terminal).subscribe({
          next: (response) => {
            if (response && response.success) {
              this.showSnackBar(response.message || 'Producto eliminado correctamente');
            } else {
              this.showSnackBar('Producto eliminado (respuesta no estándar)');
            }
            this.loadProducts();
          },
          error: (err) => {
            console.error('Error deleting product', err);
            const errorMsg = err.error?.message || 'Error al eliminar producto';
            this.showSnackBar(errorMsg);
          }
        });
      }
    });
  }

  toggleActivo(product: ProductEntity): void {
    const newState = !product.activo;
    this.productService.updateProductState(product.idProducto, newState).subscribe({
      next: () => {
        product.activo = newState;
        this.showSnackBar(`Producto ${newState ? 'activado' : 'desactivado'} correctamente`);
      },
      error: (err) => {
        console.error('Error updating product state', err);
        this.showSnackBar('Error al cambiar estado del producto');
      }
    });
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
    });
  }
}