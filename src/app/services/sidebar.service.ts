import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidenav!: MatSidenav;
  private mostrarMenuSubject = new BehaviorSubject<boolean>(true); // Valor inicial: true (visible)
  mostrarMenu$: Observable<boolean> = this.mostrarMenuSubject.asObservable();

  private mostrarMenu: boolean = false;

  setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }

  close() {
    return this.sidenav?.close();
  }

  // Métodos para controlar el estado de mostrarMenu
  setMostrarMenu(mostrar: boolean) {
    this.mostrarMenuSubject.next(mostrar);
    this.mostrarMenu = mostrar;
    console.log(" mostrarMenu$", this.mostrarMenu$);
  }

  toggleMostrarMenu() {
    this.mostrarMenuSubject.next(!this.mostrarMenuSubject.value);
    
  }

  getMostrarMenu(): boolean {
    return this.mostrarMenuSubject.value;
  }
}