import { AuditoriaEntity } from "./auditoria.entity";
  
  export class SaleEntity extends AuditoriaEntity {    
    
    idVenta!: number;    
    idUsuario!: number;       
    montoVenta!: number;    
    observacion!: string;   
    activo!: boolean;
  }
  