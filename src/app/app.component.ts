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

  onNavigationClick(action: string) {
    switch (action) {
      case 'home':
        this.router.navigate(['/home']);
        break;

      case 'mapa':
        this.router.navigate(['/map-page']);
        break;

      case 'reportes':
        this.router.navigate(['/reportes']);
        break;

      case 'alertas':
        this.router.navigate(['/alertas']);
        break;

      case 'historial-admin':
        this.router.navigate(['/historial-admin']);
        break;

      case 'estadisticas':
        this.router.navigate(['/estadisticas']);
        break;

      case 'comunidad':
        this.router.navigate(['/comunidad']);
        break;

      case 'configuracion':
        this.router.navigate(['/configuracion']);
        break;

      case 'logout':
        localStorage.removeItem('loggedUser');
        sessionStorage.clear();
        this.router.navigate(['/login']);
        break;

      default:
        console.warn('Acción no reconocida:', action);
    }
  }

  onSidebarToggle(open: boolean) {
    this.isSidebarOpen = open;
  }
}
