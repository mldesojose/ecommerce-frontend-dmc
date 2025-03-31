/* eslint-disable prettier/prettier */

import { AuditoriaEntity } from "./auditoria.entity";

export class UsuarioEntity extends AuditoriaEntity {
  idUsuario!: number;
  nomPersona!: string;
  userName!: string;
  password!: string;
  rol!: string;
  activo!: boolean;
}
