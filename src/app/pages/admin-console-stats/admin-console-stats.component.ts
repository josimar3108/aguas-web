import { NgFor } from '@angular/common';
import {
  AfterViewInit,
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Chart } from 'chart.js/auto';
import { IncidentsService } from '../../services/incidents.service';
import { AccesosService } from '../../services/accesos.service';
import { Incident } from '../../Interfaces/incident.interface';
import { HistorialAcceso } from '../../Interfaces/historial-acceso.model';

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
    { label: 'Accesos Fallidos (24h)', value: '--' },
    { label: 'Usuarios Activos', value: '--' },
  ];

  systemStatus = [
    { name: 'API Principal', status: true },
    { name: 'Servicio de Alertas', status: true },
    { name: 'Map Server', status: true },
    { name: 'DB Engine', status: true },
    { name: 'WebSocket', status: false },
  ];

  securityStats = {
    failedAttempts: 0,
    successfulAttempts: 0,
    lastAdminAccess: 'Cargando...',
    activeUsers: 0,
  };

  private graficoSemanal: Chart | null = null;
  private graficoTipos: Chart | null = null;

  private incidentesCache: Incident[] = [];

  constructor(
    private servicioIncidentes: IncidentsService,
    private servicioAccesos: AccesosService,
    private cdr: ChangeDetectorRef
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
      error: () => {
        this.kpis[0].value = 'Error';
      },
    });

    this.servicioAccesos.listarAccesos().subscribe({
      next: (data) => {
        this.calcularKpisSeguridad(data);
      },
      error: () => {
        this.kpis[5].value = 'Error';
      },
    });
  }

  private calcularKpisIncidentes(lista: Incident[]): void {
    const total = lista.length;
    const hoyString = new Date().toDateString();

    const delDia = lista.filter((i) => {
      if (!i.fecha) return false;
      const fechaObj = this.parsearFechaSegura(i.fecha);
      return fechaObj.toDateString() === hoyString;
    }).length;

    const activos = lista.filter((i) => i.status === 'PENDIENTE').length;

    const resueltos = lista.filter((i) => i.status !== 'PENDIENTE').length;
    const porcentaje = total > 0 ? Math.round((resueltos / total) * 100) : 0;

    const criticos = lista.filter((i) => {
      const tipo = (i.type || '').toLowerCase();
      return (
        tipo.includes('incendio') ||
        tipo.includes('asalto') ||
        tipo.includes('inundación')
      );
    }).length;

    this.kpis[0].value = delDia.toString();
    this.kpis[1].value = activos.toString();
    this.kpis[2].value = `${porcentaje}%`;
    this.kpis[4].value = criticos.toString();

    this.cdr.detectChanges();
  }

  private calcularKpisSeguridad(lista: HistorialAcceso[]): void {
    const ahora = new Date().getTime();
    const unDia = 24 * 60 * 60 * 1000;

    const fallidosRecientes = lista.filter((a) => {
      const fechaObj = this.parsearFechaSegura(a.fecha);
      const esReciente = ahora - fechaObj.getTime() < unDia;
      const esFallo = a.resultado?.toLowerCase() !== 'exitoso';
      return esReciente && esFallo;
    }).length;

    const usuariosUnicos = new Set(
      lista
        .filter((a) => {
          const fechaObj = this.parsearFechaSegura(a.fecha);
          const esReciente = ahora - fechaObj.getTime() < unDia;
          const fueExitoso = a.resultado?.toLowerCase() === 'exitoso';
          return esReciente && fueExitoso;
        })
        .map((a) => a.usuario)
    ).size;

    const ordenados = [...lista].sort(
      (a, b) =>
        this.parsearFechaSegura(b.fecha).getTime() -
        this.parsearFechaSegura(a.fecha).getTime()
    );

    const ultimoAcceso =
      ordenados.length > 0
        ? this.parsearFechaSegura(ordenados[0].fecha).toLocaleString()
        : 'Sin datos';

    const totalFallidos = lista.filter(
      (a) => a.resultado?.toLowerCase() !== 'exitoso'
    ).length;

    const totalExitosos = lista.length - totalFallidos;

    this.kpis[5].value = fallidosRecientes.toString();
    this.kpis[6].value = usuariosUnicos.toString();

    this.securityStats = {
      failedAttempts: totalFallidos,
      successfulAttempts: totalExitosos,
      lastAdminAccess: ultimoAcceso,
      activeUsers: usuariosUnicos,
    };

    this.cdr.detectChanges();
  }

  private generarGraficos(lista: Incident[]): void {
    if (
      !document.getElementById('weeklyChart') ||
      !document.getElementById('incidentTypesChart')
    ) {
      return;
    }

    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const conteoSemanal = [0, 0, 0, 0, 0, 0, 0];

    lista.forEach((i) => {
      if (i.fecha) {
        const d = this.parsearFechaSegura(i.fecha).getDay();
        conteoSemanal[d]++;
      }
    });

    if (this.graficoSemanal) this.graficoSemanal.destroy();
    this.graficoSemanal = new Chart('weeklyChart', {
      type: 'line',
      data: {
        labels: diasSemana,
        datasets: [
          {
            label: 'Reportes',
            data: conteoSemanal,
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79, 70, 229, 0.2)',
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
      },
    });

    const mapaTipos: { [key: string]: number } = {};
    lista.forEach((i) => {
      const t = i.type || 'Otro';
      mapaTipos[t] = (mapaTipos[t] || 0) + 1;
    });

    if (this.graficoTipos) this.graficoTipos.destroy();
    this.graficoTipos = new Chart('incidentTypesChart', {
      type: 'doughnut',
      data: {
        labels: Object.keys(mapaTipos),
        datasets: [
          {
            data: Object.values(mapaTipos),
            backgroundColor: [
              '#ef4444', 
              '#3b82f6', 
              '#f59e0b', 
              '#10b981', 
              '#8b5cf6', 
              '#6366f1', 
              '#ec4899', 
              '#14b8a6', 
              '#f97316', 
              '#64748b',
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: '65%',
        plugins: {
          legend: { position: 'right', labels: { color: '#cbd5e1' } },
        },
      },
    });
  }

  private parsearFechaSegura(fechaStr: string): Date {
    if (!fechaStr) return new Date();
    const formatoIso = fechaStr.replace(' ', 'T');
    const fecha = new Date(formatoIso);
    return isNaN(fecha.getTime()) ? new Date() : fecha;
  }
}
