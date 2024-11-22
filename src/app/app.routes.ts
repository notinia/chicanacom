import { Routes } from '@angular/router';
import { CarrerasComponent } from './carreras/carreras.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CampeonatoConductoresComponent } from './campeonato-conductores/campeonato-conductores.component';
import { AuthGuard } from './auth.guard';
import { LoginGuard } from './login.guard';
import { CampeonatoConstructoresComponent } from './campeonato-constructores/campeonato-constructores.component';
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
    path: 'campeonatoConductores',
    component: CampeonatoConductoresComponent,
    canActivate: [AuthGuard]  // Protege la ruta con AuthGuard
  },
  {
    path: 'campeonatoConstructores',
    component: CampeonatoConstructoresComponent,
    canActivate: [AuthGuard]  // Protege la ruta con AuthGuard
  },
  {
    path: 'carreras',
    component: CarrerasComponent,
    canActivate: [AuthGuard]  // Protege la ruta con AuthGuard
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login',
  }
];
