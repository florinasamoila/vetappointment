import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'inicio',
        loadComponent: () =>
          import('./tab-inicio/inicio.page').then((m) => m.TabInicio),
      },
      {
        path: 'gestion-citas',
        loadComponent: () =>
          import('./tab-gestion-citas/gestion-citas.page').then((m) => m.TabGestionCitas),
      },
      {
        path: 'registro-cliente',
        loadComponent: () =>
          import('./tab-registro-cliente/registro-cliente.page').then((m) => m.TabRegistroCliente),
      },

      {
        path: 'consultas',
        loadComponent: () =>
          import('./tab-consultas/consultas.page').then((m) => m.TabConsultas), // Ensure the file exports TabConsultas
      },
      {
        path: 'informes',
        loadComponent: () =>
          import('./tab-informes/informes.page').then((m) => m.TabInformes), // Ensure the file exports TabInformes
      },
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/inicio',
    pathMatch: 'full',
  },
];
