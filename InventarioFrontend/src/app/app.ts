import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  sidebarCollapsed = false;
  pageTitle = 'Productos';

  private titleMap: Record<string, string> = {
    '/productos': 'Gestión de Productos',
    '/productos/nuevo': 'Nuevo Producto',
    '/transacciones': 'Gestión de Transacciones',
    '/transacciones/nueva': 'Nueva Transacción',
    '/categorias': 'Categorías',
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        const url: string = e.urlAfterRedirects;
        const match = Object.keys(this.titleMap).find(k => url.startsWith(k));
        this.pageTitle = match ? this.titleMap[match] : 'Inventario';
      });
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
