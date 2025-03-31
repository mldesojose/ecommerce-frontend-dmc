import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {   

  constructor() { }

  private get usuarioStorage(): any {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing user data', e);
      return null;
    }
  }

    // Método para obtener el username
    get obtenerUsuario(): string {
    const user = this.usuarioStorage;
    return user?.username || '';
    }
    // Método para obtener el rol
    get obtenerRol(): string {
    const user = this.usuarioStorage;
    return user?.rol || '';
  }

  get obtenerUserId(): number {
    const user = this.usuarioStorage;
    return user?.userId;
    }



}
