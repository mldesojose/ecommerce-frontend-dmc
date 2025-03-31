import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // Opcional: Para mostrar errores

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si es error de parsing pero la operación fue exitosa
        if (error.status === 200 && error.error instanceof ErrorEvent) {
          return of(new HttpResponse({
            body: { success: true },
            status: 200,
            headers: error.headers,
            url: error.url || undefined
          }));
        }
  
        // Manejo de otros errores
        let errorMessage = 'Ocurrió un error inesperado';
        
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          errorMessage = error.error?.message || error.message;
          
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
        }
  
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
  
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
