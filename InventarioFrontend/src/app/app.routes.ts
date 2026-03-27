import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'productos',
    pathMatch: 'full'
  },
  {
    path: 'productos',
    loadComponent: () =>
      import('./pages/productos/productos-list/productos-list').then(m => m.ProductosList)
  },
  {
    path: 'productos/nuevo',
    loadComponent: () =>
      import('./pages/productos/producto-form/producto-form').then(m => m.ProductoForm)
  },
  {
    path: 'productos/editar/:id',
    loadComponent: () =>
      import('./pages/productos/producto-form/producto-form').then(m => m.ProductoForm)
  },
  {
    path: 'transacciones',
    loadComponent: () =>
      import('./pages/transacciones/transacciones-list/transacciones-list').then(m => m.TransaccionesList)
  },
  {
    path: 'transacciones/nueva',
    loadComponent: () =>
      import('./pages/transacciones/transaccion-form/transaccion-form').then(m => m.TransaccionForm)
  },
  {
    path: 'transacciones/editar/:id',
    loadComponent: () =>
      import('./pages/transacciones/transaccion-form/transaccion-form').then(m => m.TransaccionForm)
  },
  {
    path: 'categorias',
    loadComponent: () =>
      import('./pages/categorias/categorias-list/categorias-list').then(m => m.CategoriasList)
  },
  {
    path: '**',
    redirectTo: 'productos'
  }
];
