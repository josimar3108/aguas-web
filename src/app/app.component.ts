import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './pages/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'aguas-web';

  showSidebar = false;
  isSidebarOpen = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.url;

        this.showSidebar = currentRoute !== '/login';
      }
    });
  }

  onNavigationClick(accion: string) {
    if (accion.startsWith('/')) {
      return; 
    }

    switch (accion) {
      case 'logout':
        localStorage.removeItem('usuarioSesion'); 
        sessionStorage.clear();
        this.router.navigate(['/login']);
        break;

      default:
        console.warn('Acción no reconocida o ya manejada:', accion);
    }
  }

  onSidebarToggle(open: boolean) {
    this.isSidebarOpen = open;
  }
}
