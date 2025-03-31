import { Component, Inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { DetSaleEntity } from '../../shared/entities/detsale.entity';
import { SaleService } from '../../services/sale.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-show-sales',
  templateUrl: './sale-details-dialog.component.html',
  styleUrls: ['./sale-details-dialog.component.css'],
  standalone: true,
  imports: [CommonModule, MatTableModule,MatProgressBarModule]
})
export class SaleDetailsDialogComponent implements OnInit {
  sales: DetSaleEntity[] = [];
  displayedColumns: string[] = ['item','idProducto', 'nomProducto', 'precio', 'porcentajeOferta', 'precioFinal'];
  loading = true;

  constructor(
    public dialogRef: MatDialogRef<SaleDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { detsale: DetSaleEntity },
    private salesService: SaleService) {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.loading = true;

    this.salesService.getSaleDetails(this.data.detsale.idVenta).subscribe({
      next: (data) => {
        this.sales = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading sales:', err);
        this.loading = false;
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}