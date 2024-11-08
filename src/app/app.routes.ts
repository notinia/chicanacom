import { Routes } from '@angular/router';
import { CarrerasComponent } from './carreras/carreras.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard]  // Protege la ruta con AuthGuard
  },
  {
    path: 'conductores',
    loadComponent: () => import('./conductores/conductores.component').then(m => m.ConductoresComponent),
    canActivate: [AuthGuard]  // Protege la ruta con AuthGuard
  },
  {
    path: 'carreras',
    component: CarrerasComponent,
    canActivate: [AuthGuard]  // Protege la ruta con AuthGuard
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  { 
    path: '', 
    redirectTo: '/home', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: '/home' 
  }
];
