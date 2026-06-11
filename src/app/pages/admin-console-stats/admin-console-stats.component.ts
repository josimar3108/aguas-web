import { NgFor } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Chart } from 'chart.js/auto';
import { IncidentsService } from '../../services/incidents.service';
import { Incident } from '../../Interfaces/incident.interface';

@Component({
  selector: 'app-admin-console-stats',
  standalone: true,
  imports: [NgFor],
  templateUrl: './admin-console-stats.component.html',
  styleUrls: ['./admin-console-stats.component.scss'],
})
export class AdminConsoleStatsComponent implements OnInit, AfterViewInit {
  kpis = [
    { label: 'Incidentes Hoy', value: '--' },
    { label: 'Activos', value: '--' },
    { label: 'Resueltos (%)', value: '--' },
    { label: 'T. Respuesta', value: 'N/A' },
    { label: 'Críticos', value: '--' },
  ];

  private charts: Chart[] = [];
  private incidentesCache: Incident[] = [];

  constructor(
    private servicioIncidentes: IncidentsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarDatosReales();
  }

  ngAfterViewInit(): void {
    if (this.incidentesCache.length > 0) {
      this.generarGraficos(this.incidentesCache);
    }
  }

  private cargarDatosReales(): void {
    this.servicioIncidentes.getAllReal().subscribe({
      next: (data) => {
        this.incidentesCache = data;
        this.calcularKpisIncidentes(data);
        this.generarGraficos(data);
      },
    });
  }

  private calcularKpisIncidentes(lista: Incident[]): void {
    const total = lista.length;
    const hoyString = new Date().toDateString();

    const delDia = lista.filter(
      (i) => i.fecha && new Date(i.fecha).toDateString() === hoyString,
    ).length;
    const activos = lista.filter(
      (i) => i.status === 'PENDING' || i.status === 'PENDIENTE',
    ).length;
    const resueltos = lista.filter(
      (i) => i.status === 'RESOLVED' || i.status === 'RESUELTO',
    ).length;
    const porcentaje = total > 0 ? Math.round((resueltos / total) * 100) : 0;
    const criticos = lista.filter((i) => {
      const tipo = (i.type || '').toLowerCase();
      return (
        tipo.includes('fire') ||
        tipo.includes('incendio') ||
        tipo.includes('robbery') ||
        tipo.includes('asalto')
      );
    }).length;

    this.kpis[0].value = delDia.toString();
    this.kpis[1].value = activos.toString();
    this.kpis[2].value = `${porcentaje}%`;
    this.kpis[4].value = criticos.toString();
    this.cdr.detectChanges();
  }

  private generarGraficos(lista: Incident[]): void {
    this.charts.forEach((c) => c.destroy());
    this.charts = [];

    // 1. Tendencia Semanal (Original)
    const ctx1 = document.getElementById('weeklyChart') as HTMLCanvasElement;
    const dias = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    const conteo = new Array(7).fill(0);
    lista.forEach((i) => {
      if (i.fecha) conteo[new Date(i.fecha).getDay()]++;
    });

    this.charts.push(
      new Chart(ctx1, {
        type: 'line',
        data: {
          labels: dias,
          datasets: [
            {
              label: 'Incidentes',
              data: conteo,
              borderColor: '#36a2eb',
              tension: 0.3,
            },
          ],
        },
      }),
    );

    // 2. Incidentes por Tipo (Colores Dinámicos)
    const ctx2 = document.getElementById(
      'incidentTypesChart',
    ) as HTMLCanvasElement;
    const tipos = lista.map((i) => i.type || 'Desconocido');
    const conteoTipos = tipos.reduce((acc: any, t) => {
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {});

    const colores = [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
      '#FF9F40',
    ];
    const backgroundColors = Object.keys(conteoTipos).map(
      (_, index) => colores[index % colores.length],
    );

    this.charts.push(
      new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: Object.keys(conteoTipos),
          datasets: [
            {
              label: 'Cantidad',
              data: Object.values(conteoTipos),
              backgroundColor: backgroundColors,
            },
          ],
        },
      }),
    );

    // 3. Distribución de Riesgo (Nueva)
    const ctx3 = document.getElementById(
      'riskDistributionChart',
    ) as HTMLCanvasElement;
    this.charts.push(
      new Chart(ctx3, {
        type: 'pie',
        data: {
          labels: ['Bajo', 'Medio', 'Alto'],
          datasets: [
            {
              data: [10, 5, 2],
              backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
            },
          ],
        },
      }),
    );
  }
}
