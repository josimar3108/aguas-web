import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MapPageComponent } from '../map-page/map-page.component';

interface KpiMetric {
  title: string;
  value: string;
  indicator: 'up' | 'down' | 'neutral' | 'goal';
  trend: string;
  color: 'primary' | 'success' | 'warning' | 'danger';
}

interface PendingReport {
  id: number;
  type: string;
  location: string;
  timeReported: string;
}

@Component({
  selector: 'app-home-dashboard',
  standalone: true,
  imports: [CommonModule, MapPageComponent],
  templateUrl: './home-dashboard.component.html',
  styleUrls: ['./home-dashboard.component.scss'],
})
export class HomeDashboardComponent implements OnInit {
  sidebarOpen: boolean = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  kpis: KpiMetric[] = [];

  pendingReports: PendingReport[] = [];

  teamLoad: { team: string; count: number }[] = [
    { team: 'Obras Públicas ', count: 15 },
    { team: 'Tránsito ', count: 8 },
    { team: 'Bomberos ', count: 5 },
    { team: 'Policía ', count: 10 },
  ];

  ngOnInit(): void {
    this.loadKpis();
    this.loadPendingReports();
  }

  loadKpis(): void {
    this.kpis = [
      {
        title: 'Incidentes Activos',
        value: '124',
        indicator: 'up',
        trend: '⬆️ 5% vs. ayer',
        color: 'warning',
      },
      {
        title: 'Tiempo Promedio de Respuesta (TMR)',
        value: '1h 45m',
        indicator: 'down',
        trend: '⬇️ 10m vs. semana pasada',
        color: 'success',
      },
      {
        title: 'Tasa de Resolución',
        value: '88%',
        indicator: 'goal',
        trend: '✅ Objetivo cumplido',
        color: 'primary',
      },
      {
        title: 'Riesgo Operacional Actual',
        value: 'ALTO',
        indicator: 'up',
        trend: 'Reportes críticos: 7',
        color: 'danger',
      },
    ];
  }

  loadPendingReports(): void {
    this.pendingReports = [
      {
        id: 4530,
        type: 'Inundación',
        location: 'Av. Juárez 123',
        timeReported: 'Hace 8 min',
      },
      {
        id: 4529,
        type: 'Robo',
        location: 'Calle Del Río',
        timeReported: 'Hace 15 min',
      },
      {
        id: 4528,
        type: 'Tráfico',
        location: 'Bvld. Principal',
        timeReported: 'Hace 25 min',
      },
      {
        id: 4527,
        type: 'Infraestructura',
        location: 'Zona Industrial',
        timeReported: 'Hace 45 min',
      },
    ];
  }

  assignReport(reportId: number): void {
    console.log(`Asignando el reporte ID: ${reportId}`);
  }

  getBarWidth(count: number): number {
    const max = Math.max(...this.teamLoad.map((item) => item.count));
    return (count / max) * 100;
  }
}
