// app.component.ts
import { Component, inject, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router,RouterOutlet,RouterLink } from '@angular/router';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe} from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { SidebarService } from './services/sidebar.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterLink,      
    RouterOutlet,
    MatMenuModule,
    MatSnackBarModule,    
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  mostrarMenu: boolean = true;//(localStorage.getItem('isLoggedIn') === 'true');

  private mostrarMenuSubject = new BehaviorSubject<boolean>(false); // Valor inicial: true (visible)
  mostrarMenu$: Observable<boolean> = this.mostrarMenuSubject.asObservable();

  @ViewChild('drawer') drawer!: MatSidenav;

  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(    
    private router: Router,    
    private sidebarService: SidebarService,
    private authService: AuthService
    
  ) {
    this.mostrarMenu$ = this.sidebarService.mostrarMenu$;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
  }

  isHomeRoute(): boolean {
    return this.router.url === '/';
  }

  logout() {
    // Cierra el sidebar
    this.drawer.close();
    this.authService.logout();   

    //this.sidebarService.close();
    
    // 1. Cerrar sesión en el servidor (si es necesario)
    // this.authService.logout().subscribe();
 
    // 3. Redirigir al login
    this.router.navigate(['/login']);
    
    // 4. Recargar la aplicación si es necesario
    // window.location.reload();
  }

}