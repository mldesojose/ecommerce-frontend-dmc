import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {   

  constructor(private http: HttpClient,
              private storageService: StorageService, 
  ) { }


  // Método para obtener el username
get obtenerUsuario(): string {
  const username = this.storageService.obtenerUsuario;
  return username || '';
}
// Método para obtener el rol
get obtenerRol(): string {
  const rol = this.storageService.obtenerRol;
  return rol || '';
}


  obtenerTerminal(): Observable<string> {
    return this.http.get<{ ip: string }>('http://localhost:3000/api/Usuario/ip').pipe(
      map(response => response.ip || '127.0.0.3'),
      catchError(() => of('127.0.0.3')) // Fallback si hay error
    );
  }
}
