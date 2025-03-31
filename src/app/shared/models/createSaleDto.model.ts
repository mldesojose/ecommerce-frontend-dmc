export interface CreateSaleDto {
        idUsuario: number;
        idProducto: number;
        montoVenta: number;
        observacion?: string;
        precio: number;
        porcentajeOferta: number;
        precioFinal: number;
        activo: boolean;
        usuarioCreacion: string;
        terminalCreacion: string;
  }