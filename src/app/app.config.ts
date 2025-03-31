import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ErrorInterceptor } from './interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
              provideZoneChangeDetection({ eventCoalescing: true }), 
              provideRouter(routes),              
              provideAnimations(),
              provideHttpClient( withInterceptorsFromDi() ),// ← Necesario para habilitar interceptores DI
              {
                provide: HTTP_INTERCEPTORS,
                useClass: ErrorInterceptor,
                multi: true, // Permite múltiples interceptores
              }
            ]
};


