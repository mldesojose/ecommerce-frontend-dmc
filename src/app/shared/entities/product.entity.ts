import { AuditoriaEntity } from "./auditoria.entity";

  
  export class ProductEntity extends AuditoriaEntity {          
    idProducto!: number;          
    nomProducto!: string;     
    descripcion!: string;     
    precio!: number;   
    imgUrl!: string;   
    isOferta!: boolean;    
    porcentajeOferta!: number;    
    precioFinal!: number;    
    activo!: boolean;
  }
  
