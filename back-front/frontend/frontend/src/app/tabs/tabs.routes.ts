// src/app/tabs/tabs.routes.ts
import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'inicio',
        loadComponent: () =>
          import('./tab-inicio/inicio.page').then(m => m.TabInicio),
      },
      {
        path: 'gestion-citas',
        loadComponent: () =>
          import('./tab-gestion-citas/gestion-citas.page').then(m => m.TabGestionCitas),
      },
      {
        path: 'registro-cliente',
        loadComponent: () =>
          import('./tab-registro-cliente/registro-cliente.page').then(m => m.TabRegistroCliente),
      },
      {
        path: 'consultas',
        loadComponent: () =>
          import('./tab-consultas/consultas.page').then(m => m.TabConsultas),
      },
      {
        path: 'gestion-historial-medico',
        loadComponent: () =>
          import(
            './tab-gestion-historial-medico/gestion-historial-medico/gestion-historial-medico.page'
          ).then(m => m.GestionHistorialMedicoPage),
      },
      // Al entrar en /tabs → redirige a /tabs/inicio
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full',
      },
    ],
  },
];
