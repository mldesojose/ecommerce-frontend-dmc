import { AuditoriaEntity } from "./auditoria.entity";

  export class DetSaleEntity extends AuditoriaEntity {          
    idVenta!: number;    
    item!: number;
    idProducto!: number;      
    nomProducto!: string;         
    precio!: number;           
    porcentajeOferta!: number;    
    precioFinal!: number;    
    activo!: boolean;
  }
  
