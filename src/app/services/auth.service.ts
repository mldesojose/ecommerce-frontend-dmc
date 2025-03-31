import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { UsuarioEntity } from '../shared/entities/usuario.entity';
import { StorageService } from './storage.service';

interface User {
  username: string;
  rol:string;
  userId:number;
  // Add more user properties if needed
}

type TokenResponse = {
  access_token: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private currentUser = new BehaviorSubject<User | null>(null);
  //private currentUser: any;
  

  private readonly apiUrl = "http://localhost:3000";

  constructor(
    private readonly http: HttpClient,
    private storageService: StorageService,
  ) {}

  async loginService(
    username: string,
    password: string
  ): Promise<TokenResponse> {
    const body = { username, password };
    return firstValueFrom(
      this.http.post<TokenResponse>(`${this.apiUrl}/api/Usuario/login`, body)
    ).catch((error) => {
      // Puedes agregar lógica adicional aquí si es necesario
      throw error; // El interceptor ya mostró el mensaje
    });
  }

  async usuarioService(    
    username: string,
    password: string
  ): Promise<UsuarioEntity> {
    const body = { username, password };
    return firstValueFrom(
      this.http.post<UsuarioEntity>(`${this.apiUrl}/api/Usuario/usuario`,body)
    ).catch((error) => {
      // Puedes agregar lógica adicional aquí si es necesario
      throw error; // El interceptor ya mostró el mensaje
    });
  }


  async login(username: string, password: string): Promise<boolean> {
    const auth = await this.loginService(username, password);    
    if (auth.access_token) {

 
      const usuario: UsuarioEntity = await this.usuarioService(username, password);
      const rol = usuario.rol; // Aquí accedes al campo rol
      const userId = usuario.idUsuario; 
      
      // es correcto
      const user: User = { username, rol, userId };
      this.isAuthenticated.next(true);
      this.currentUser.next(user);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('access_token', auth.access_token);
      return true;
    }
    this.logout();
    return false;
  }

  logout() {
    this.isAuthenticated.next(false);
    this.currentUser.next(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
  }

  isLoggedIn() {
    return this.isAuthenticated.asObservable();
  }

  getCurrentUser() {
    return this.currentUser.asObservable();
  }

  checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userStr = localStorage.getItem('user');

    if (isLoggedIn && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.isAuthenticated.next(true);
        this.currentUser.next(user);
      } catch (e) {
        this.logout(); // Clear invalid data
      }
    } else {
      this.logout(); // Ensure clean state
    }
  }
  isAuthenticateds(): boolean {
    const rol = this.storageService.obtenerRol;
    return rol == 'ADMIN';
  }

  hasAnyRole(role: string): boolean {
    if (!role || role.length === 0) return true;
    const user = this.getCurrentUser();
    return user==null;
  }

}
