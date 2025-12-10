import { Routes } from '@angular/router';
import { MapPageComponent } from './pages/map-page/map-page.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeDashboardComponent } from './pages/home-dashboard/home-dashboard.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { AlertasComponent } from './pages/alertas/alertas.component';
import { HistorialAdminComponent } from './pages/historial-admin/historial-admin.component';
import { AdminConsoleStatsComponent } from './pages/admin-console-stats/admin-console-stats.component';
import { ComunidadComponent } from './pages/comunidad/comunidad.component';
import { ConfiguracionComponent } from './pages/configuracion/configuracion.component';
import { CreditosComponent } from './pages/creditos/creditos.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeDashboardComponent },
    { path: 'map-page', component: MapPageComponent },
    { path: 'reportes', component: ReportesComponent },
    { path: 'alertas', component: AlertasComponent },
    { path: 'historial-admin', component: HistorialAdminComponent },
    { path: 'estadisticas', component: AdminConsoleStatsComponent},
    { path: 'comunidad', component: ComunidadComponent},
    { path: 'configuracion', component: ConfiguracionComponent},
    { path: 'creditos', component: CreditosComponent },
    { path: '**', redirectTo: 'login' }
];
