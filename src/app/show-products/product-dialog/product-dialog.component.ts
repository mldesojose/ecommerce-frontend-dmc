import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductEntity } from '../../shared/entities/product.entity';
import { AuthService } from '../../services/auth.service';
import { AuditoriaService } from '../../services/auditoria.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-dialog',  
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
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
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.css']
})
export class ProductDialogComponent implements OnInit {  
  
    productForm!: FormGroup;
    isOferta = false;

  constructor(    
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProductDialogComponent>,    
    private auditoriaService: AuditoriaService,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'add' | 'edit', product?: ProductEntity }
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.setupOfertaListener();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      nomProducto: ['', [Validators.required, Validators.maxLength(30)]],
      descripcion: ['', [Validators.required, Validators.maxLength(100)]],
      imgUrl: ['', [Validators.required, Validators.maxLength(500)]],
      precio: ['', [Validators.required, Validators.min(0)]],
      isOferta: [false],
      porcentajeOferta: [{value: 0, disabled: true}, [Validators.min(0), Validators.max(100)]],
      precioFinal: [{value: 0, disabled: true}]
    });

    if (this.data.mode === 'edit' && this.data.product) {
      this.productForm.patchValue(this.data.product);
      this.isOferta = this.data.product.isOferta;
      if (this.isOferta) {
        this.productForm.get('porcentajeOferta')?.enable();
        this.productForm.get('precioFinal')?.enable();
      }
    }
  }

  setupOfertaListener(): void {
    this.productForm.get('isOferta')?.valueChanges.subscribe(value => {
      this.isOferta = value;
      const porcentajeControl = this.productForm.get('porcentajeOferta');
      const precioFinalControl = this.productForm.get('precioFinal');
      
      if (value) {
        porcentajeControl?.enable();
        precioFinalControl?.enable();
        this.calculatePrecioFinal();
      } else {
        porcentajeControl?.disable();
        precioFinalControl?.disable();
        precioFinalControl?.setValue(0);
      }
    });

    this.productForm.get('precio')?.valueChanges.subscribe(() => {
      if (this.isOferta) {
        this.calculatePrecioFinal();
      }
    });

    this.productForm.get('porcentajeOferta')?.valueChanges.subscribe(() => {
      if (this.isOferta) {
        this.calculatePrecioFinal();
      }
    });
  }

  calculatePrecioFinal(): void {
    const precio = this.productForm.get('precio')?.value || 0;
    const descuento = this.productForm.get('porcentajeOferta')?.value || 0;
    const precioFinal = precio * (1 - (descuento / 100));
    this.productForm.get('precioFinal')?.setValue(precioFinal);
  }

  onSave(): void {
    if (this.productForm.valid) {                 

      let terminal: string = ' 127.0.0.10';
      this.onTerminal().subscribe(ip => {        
        terminal = ip;
      });

      if (this.data.mode === 'edit'){

        const productData = {
          ...this.productForm.value,
          activo: true,
          usuarioModificacion: this.auditoriaService.obtenerUsuario, 
          terminalModificacion: terminal,          
        };          
        this.dialogRef.close(productData);

      }else{

        const productData = {
          ...this.productForm.value,
          activo: true,
          usuarioCreacion: this.auditoriaService.obtenerUsuario, 
          terminalCreacion: terminal,          
        };
        this.dialogRef.close(productData);
      }  
    }
  }

  onTerminal(): Observable<string> {
    return this.auditoriaService.obtenerTerminal();
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}