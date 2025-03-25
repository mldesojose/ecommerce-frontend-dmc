import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userName: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onLogin() {
    // Lógica de autenticación (puedes integrar AuthService aquí)    
    this.router.navigate(['/main']); // Redirige tras login exitoso
  }

  goBack() {
    this.router.navigate(['/']); // Navega a la página anterior
  }
}