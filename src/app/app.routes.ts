import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),  // Home para '/'
      },
      {
        path: 'conductores',
        loadComponent: () => import('./conductores/conductores.component').then(m => m.ConductoresComponent)  // Ruta de Conductores
      }
];
