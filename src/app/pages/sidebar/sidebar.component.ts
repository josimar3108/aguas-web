import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

interface NavItem {
  item: string;
  icon: string;
  action?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgFor, CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  isOpen = false;
  user: any = null;

  @Output() navClick = new EventEmitter<string>();

  @Output() sidebarToggle = new EventEmitter<boolean>();

  @Output() toggle = new EventEmitter<boolean>();

constructor() {
  const storedUser = localStorage.getItem('loggedUser');
  this.user = storedUser ? JSON.parse(storedUser) : null;
}

  navItems: NavItem[] = [
    {
      item: 'Home',
      icon: 'home',
      action: 'home',
    },
    {
      item: 'Reportes',
      icon: 'report',
      action: 'reportes',
    },
    {
      item: 'Mapa',
      icon: 'map',
      action: 'mapa',
    },
    {
      item: 'Alertas',
      icon: 'notifications',
      action: 'alertas',
    },
    {
      item: 'Historial',
      icon: 'history',
      action: 'historial-admin',
    },
    {
      item: 'Estadísticas',
      icon: 'analytics',
      action: 'estadisticas',
    },
    {
      item: 'Comunidad',
      icon: 'groups',
      action: 'comunidad',
    },
    {
      item: 'Configuración',
      icon: 'settings',
      action: 'configuracion',
    },
    {
      item: 'Cerrar sesión',
      icon: 'logout',
      action: 'logout',
    },
  ];

  toggleSidebar(): void {
  this.isOpen = !this.isOpen;
  this.sidebarToggle.emit(this.isOpen);
}

  onNavItemClick(action: string) {
    console.log('Nav click:', action); 
    this.navClick.emit(action);
  }
}
