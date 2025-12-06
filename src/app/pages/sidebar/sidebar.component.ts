import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

interface ItemNavegacion
{
  nombre: string;
  icono: string;
  accion?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgFor, CommonModule, NgIf, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent
{
  estaAbierto = false;
  usuario: any = null;
  elementosNavegacion: ItemNavegacion[] = [];

  @Output() clicNavegacion = new EventEmitter<string>();
  @Output() alternarSidebar = new EventEmitter<boolean>();
  @Output() alternar = new EventEmitter<boolean>();

  constructor(public router: Router)
  {
    //Obtener usuario de la sesión
    const usuarioGuardado = localStorage.getItem('usuarioSesion');
    this.usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

    //Inicializar menú
    this.configurarMenu();
  }

  configurarMenu()
  {
    //Cargar todas las opciones directamente
    this.elementosNavegacion = [
      { nombre: 'Home', icono: 'home', accion: '/home' },
      { nombre: 'Reportes', icono: 'report', accion: '/reportes' },
      { nombre: 'Mapa', icono: 'map', accion: '/map-page' },
      { nombre: 'Alertas', icono: 'notifications', accion: '/alertas' },
      { nombre: 'Historial', icono: 'history', accion: '/historial-admin' },
      { nombre: 'Estadísticas', icono: 'analytics', accion: '/estadisticas' },
      //{ nombre: 'Comunidad', icono: 'groups', accion: '/comunidad' },
      { nombre: 'Configuración', icono: 'settings', accion: '/configuracion' },
      { nombre: 'Cerrar sesión', icono: 'logout', accion: 'logout' },
    ];
  }

  alternarBarraLateral(): void
  {
    this.estaAbierto = !this.estaAbierto;
    this.alternarSidebar.emit(this.estaAbierto);
  }

  alHacerClicItem(accion: string)
  {
    console.log('Navegación:', accion);

    if(accion === 'logout')
    {
      //Cerrar sesión y redirigir
      localStorage.removeItem('usuarioSesion');
      this.router.navigate(['/login']);
    }
    else
    {
      //Navegar a la ruta seleccionada
      this.router.navigate([accion]);
    }

    this.clicNavegacion.emit(accion);
  }
}