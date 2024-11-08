import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CarrerasComponent } from './carreras/carreras.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
export const routes: Routes = [
      {
      path: 'home',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
       },
      {
        path: 'conductores',
        loadComponent: () => import('./conductores/conductores.component').then(m => m.ConductoresComponent)  // Ruta de Conductores
      },
      { path: 'carreras', component: CarrerasComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: '/home', pathMatch: 'full' },  // Redirigir a /home al iniciar
      { path: '**', redirectTo: '/home' } 
];
