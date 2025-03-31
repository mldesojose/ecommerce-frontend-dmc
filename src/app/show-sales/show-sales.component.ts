import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SaleService } from '../services/sale.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { CurrencyPipe } from '@angular/common';
import { SaleEntity } from '../shared/entities/sale.entity';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { SaleDetailsDialogComponent } from './sale-details-dialog/sale-details-dialog.component';
import { DetSaleEntity } from '../shared/entities/detsale.entity';
@Component({
  selector: 'app-show-sales',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatProgressBarModule,
    CurrencyPipe,
    ],
  templateUrl: './show-sales.component.html',
  styleUrls: ['./show-sales.component.css']
})
export class ShowSalesComponent implements OnInit {
  displayedColumns: string[] = ['idVenta', 'idUsuario', 'montoVenta', 'observacion', 'activo', 'actions'];
  dataSource = new MatTableDataSource<SaleEntity>();

  isLoading = true;

  constructor(
    private saleService: SaleService,
    public dialog: MatDialog,    
    //private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.isLoading = true;
    this.saleService.getAllSales().subscribe({
      next: (sales) => {
        this.dataSource.data = sales;
        this.isLoading = false;
      },
      error: (error) => {
       // this.notificationService.showError('Error al cargar las ventas');
        this.isLoading = false;
        console.error('Error loading sales:', error);
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteSale(sale: SaleEntity): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmar eliminación',
        message: `¿Está seguro que desea eliminar la venta con ID ${sale.idVenta}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saleService.deleteSale(sale.idVenta).subscribe({
          next: () => {
            //this.notificationService.showSuccess('Venta eliminada correctamente');
            this.loadSales();
          },
          error: (error) => {
            //this.notificationService.showError('Error al eliminar la venta');
            console.error('Error deleting sale:', error);
          }
        });
      }
    });
  }

  toggleActive(sale: SaleEntity): void {
    const newStatus = !sale.activo;
    this.saleService.updateSaleStatus(sale.idVenta, newStatus).subscribe({
      next: () => {
        sale.activo = newStatus;
       // this.notificationService.showSuccess(`Venta ${newStatus ? 'activada' : 'desactivada'} correctamente`);
      },
      error: (error) => {
       // this.notificationService.showError('Error al cambiar el estado de la venta');
        console.error('Error updating sale status:', error);
      }
    });
  }

  

    viewSaleDetails(detsale: DetSaleEntity): void {      
      this.saleService.getSaleDetails(detsale.idVenta).subscribe(details => {
        this.dialog.open(SaleDetailsDialogComponent, {
          width: '600px',
          data: { 
            detsale: detsale
          }
        });
      });
    }  
}