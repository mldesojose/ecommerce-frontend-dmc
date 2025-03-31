import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSidenav } from '@angular/material/sidenav';
import { SidebarService } from '../services/sidebar.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  returnUrl: string;


  constructor(
    private authService: AuthService, 
    private router: Router,
    private sidebarService: SidebarService,
    private route:ActivatedRoute,
    private storageService:StorageService,

    
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  async onLogin() {


    const auth = await this.authService.login(this.username, this.password);
    const rol =this.storageService.obtenerRol;
    if (auth) {      
      console.log("rol 1 ->",rol);
      if (rol.includes('ADMIN')) {
        console.log("rol 2 ->",rol)
        this.router.navigate(['/home']);
      } else if (rol.includes('CLIENTE')) {
        console.log("rol 3 ->",rol);
        this.router.navigate(['/tienda']);
      }      
    } else {
      console.log("rol 4 ->",rol);
      this.router.navigate(['/login']);
      //this.errorMessage = 'Usuario o contraseña incorrectos';
    }

  }

  goBack() {
    this.router.navigate(['/home']); // Navega a la página anterior
  }

  ocultarMenu() {
    this.sidebarService.setMostrarMenu(false);
  }

  mostrarMenu() {
    this.router.navigate(['/home']);
    this.sidebarService.setMostrarMenu(true);
  }
}