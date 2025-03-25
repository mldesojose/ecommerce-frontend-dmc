import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- Asegúrate de importar esto
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  imports: [FormsModule,HttpClientModule], // <-- Importa FormsModule aquí
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    username: '',
    password: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    
    this.http.post('http://localhost:3000/api/Usuario/login', this.credentials)
      .subscribe(
        (response: any) => {
          // Guardar el token en el almacenamiento local
          localStorage.setItem('token', response.token);
          // Redirigir al usuario a la página de inicio
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Error en el inicio de sesión:', error);
          alert('Credenciales incorrectas');
        }
      );
  }
}