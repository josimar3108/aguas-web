import { NgFor } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { Chart } from 'chart.js/auto';


@Component({
  selector: 'app-admin-console-stats',
  standalone: true,
  imports: [NgFor],
  templateUrl: './admin-console-stats.component.html',
  styleUrls: ['./admin-console-stats.component.scss']
})
export class AdminConsoleStatsComponent implements AfterViewInit {

  kpis = [
    { label: 'Incidentes Hoy', value: 48 },
    { label: 'Activos', value: 12 },
    { label: 'Resueltos (%)', value: '78%' },
    { label: 'T. Respuesta', value: '1h 20m' },
    { label: 'Críticos', value: 3 },
    { label: 'Accesos Fallidos (24h)', value: 4 },
    { label: 'Usuarios Activos', value: 5 }
  ];

  systemStatus = [
    { name: 'API Principal', status: true },
    { name: 'Servicio de Alertas', status: true },
    { name: 'Map Server', status: false },
    { name: 'DB Engine', status: true },
    { name: 'WebSocket', status: true }
  ];

  securityStats = {
    failedAttempts: 14,
    successfulAttempts: 122,
    lastAdminAccess: 'Hoy 14:32',
    activeUsers: 5
  };

  ngAfterViewInit(): void {
    this.loadWeeklyTrendChart();
    this.loadIncidentTypeChart();
  }

  private loadWeeklyTrendChart(): void {
    new Chart('weeklyChart', {
      type: 'line',
      data: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [{
          data: [12, 19, 8, 15, 20, 14, 10],
          label: 'Incidentes',
          borderWidth: 2,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  private loadIncidentTypeChart(): void {
    new Chart('incidentTypesChart', {
      type: 'doughnut',
      data: {
        labels: ['Asalto', 'Accidente', 'Robo', 'Vandalismo', 'Otros'],
        datasets: [{
          data: [35, 25, 20, 10, 10],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        cutout: '60%'
      }
    });
  }
}