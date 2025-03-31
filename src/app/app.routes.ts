// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ShowProductsComponent } from './show-products/show-products.component';
import { ShowSalesComponent } from './show-sales/show-sales.component';
import { ShopComponent } from './carrito/shop/shop.component';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [AuthGuard],    
  },
  { 
    path: 'productos', 
    component: ShowProductsComponent,
    canActivate: [AuthGuard],    
  },
  { 
    path: 'ventas', 
    component: ShowSalesComponent,
    canActivate: [AuthGuard],    
  },
  { path: 'tienda', component: ShopComponent },  
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];