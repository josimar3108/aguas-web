import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { MapPageComponent } from '../map-page/map-page.component';
import { IncidentsService } from '../../services/incidents.service';
import { Incident } from '../../Interfaces/incident.interface';

interface KpiMetric {
  title: string;
  value: string;
  indicator: 'up' | 'down' | 'neutral' | 'goal';
  trend: string;
  color: 'primary' | 'success' | 'warning' | 'danger';
}

interface PendingReport {
  id: string;
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
export class HomeDashboardComponent implements OnInit, OnDestroy {
  @ViewChild(MapPageComponent) mapa!: MapPageComponent;

  sidebarOpen: boolean = false;

  private intervaloRefresco: any;
  private listaCompletaIncidentes: Incident[] = [];

  kpis: KpiMetric[] = [
    {
      title: 'Incidentes Activos',
      value: '--',
      indicator: 'neutral',
      trend: 'Cargando...',
      color: 'warning',
    },
    {
      title: 'Tiempo Promedio (TMR)',
      value: '--',
      indicator: 'neutral',
      trend: 'Calculando...',
      color: 'success',
    },
    {
      title: 'Tasa de Resolución',
      value: '--',
      indicator: 'neutral',
      trend: '...',
      color: 'primary',
    },
    {
      title: 'Riesgo Operacional',
      value: '--',
      indicator: 'neutral',
      trend: '...',
      color: 'danger',
    },
  ];

  pendingReports: PendingReport[] = [];

  teamLoad: { team: string; count: number }[] = [
    { team: 'Obras Públicas ', count: 0 },
    { team: 'Tránsito ', count: 0 },
    { team: 'Bomberos ', count: 0 },
    { team: 'Policía ', count: 0 },
  ];

  constructor(
    private incidentsSvc: IncidentsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarDatosReales();

    this.intervaloRefresco = setInterval(() => {
      this.cargarDatosReales();
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this.intervaloRefresco) {
      clearInterval(this.intervaloRefresco);
    }
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  cargarDatosReales(): void {
    this.incidentsSvc.getAllReal().subscribe({
      next: (data) => {
        this.listaCompletaIncidentes = data;
        this.procesarKPIs(data);
        this.procesarTablaPendientes(data);
        this.procesarCargaEquipos(data);
        this.cdr.detectChanges();
      },
      error: (e) => console.error(e),
    });
  }

  private procesarKPIs(lista: Incident[]) {
    const total = lista.length;

    const activos = lista.filter((i) => i.status === 'PENDIENTE').length;

    const resueltos = lista.filter((i) => i.status !== 'PENDIENTE').length;
    const tasaResolucion =
      total > 0 ? Math.round((resueltos / total) * 100) : 0;

    const criticosActivos = lista.filter(
      (i) =>
        i.status === 'PENDIENTE' &&
        (i.type.toLowerCase().includes('incendio') ||
          i.type.toLowerCase().includes('asalto') ||
          i.type.toLowerCase().includes('inundación'))
    ).length;

    let nivelRiesgo = 'BAJO';
    let colorRiesgo: 'success' | 'warning' | 'danger' = 'success';

    if (criticosActivos > 2) {
      nivelRiesgo = 'MEDIO';
      colorRiesgo = 'warning';
    }
    if (criticosActivos > 5) {
      nivelRiesgo = 'ALTO';
      colorRiesgo = 'danger';
    }

    this.kpis[0] = {
      title: 'Incidentes Activos',
      value: activos.toString(),
      indicator: activos > 5 ? 'up' : 'neutral',
      trend: 'En tiempo real',
      color: 'warning',
    };

    this.kpis[1] = {
      title: 'Tiempo Promedio (TMR)',
      value: 'N/A',
      indicator: 'neutral',
      trend: 'Requiere fecha cierre',
      color: 'success',
    };

    this.kpis[2] = {
      title: 'Tasa de Resolución',
      value: `${tasaResolucion}%`,
      indicator: tasaResolucion > 80 ? 'goal' : 'down',
      trend:
        tasaResolucion > 80 ? '✅ Objetivo cumplido' : '⚠️ Bajo rendimiento',
      color: 'primary',
    };

    this.kpis[3] = {
      title: 'Riesgo Operacional',
      value: nivelRiesgo,
      indicator: nivelRiesgo === 'ALTO' ? 'up' : 'neutral',
      trend: `Críticos activos: ${criticosActivos}`,
      color: colorRiesgo,
    };
  }

  private procesarTablaPendientes(lista: Incident[]) {
    const pendientes = lista
      .filter((i) => i.status === 'PENDIENTE')
      .sort(
        (a, b) =>
          this.parsearFecha(b.fecha).getTime() -
          this.parsearFecha(a.fecha).getTime()
      )
      .slice(0, 5);

    this.pendingReports = pendientes.map((p) => ({
      id: p.id.substring(0, 8),
      type: p.type,
      location: p.address || 'Ubicación GPS',
      timeReported: this.calcularTiempoRelativo(p.fecha),
    }));
  }

  private procesarCargaEquipos(lista: Incident[]) {
    const carga = {
      'Obras Públicas ': 0,
      'Tránsito ': 0,
      'Bomberos ': 0,
      'Policía ': 0,
    };

    lista.forEach((inc) => {
      if (inc.status === 'PENDIENTE') {
        const tipo = inc.type.toLowerCase();

        if (
          tipo.includes('fuga') ||
          tipo.includes('inundación') ||
          tipo.includes('bache')
        ) {
          carga['Obras Públicas ']++;
        } else if (
          tipo.includes('choque') ||
          tipo.includes('vialidad') ||
          tipo.includes('accidente')
        ) {
          carga['Tránsito ']++;
        } else if (tipo.includes('incendio') || tipo.includes('explosión')) {
          carga['Bomberos ']++;
        } else if (
          tipo.includes('robo') ||
          tipo.includes('asalto') ||
          tipo.includes('manifestación')
        ) {
          carga['Policía ']++;
        } else {
          carga['Obras Públicas ']++;
        }
      }
    });

    this.teamLoad = Object.keys(carga).map((key) => ({
      team: key,
      count: carga[key as keyof typeof carga],
    }));
  }

  locateIncident(idVisual: string): void {
    const incidente = this.listaCompletaIncidentes.find((i) =>
      i.id.startsWith(idVisual)
    );

    if (incidente && this.mapa) {
      this.mapa.flyTo(incidente.latitude, incidente.longitude);

      document
        .querySelector('.map-section')
        ?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  assignReport(reportId: string): void {
    alert('Funcionalidad de asignación en desarrollo');
  }

  getBarWidth(count: number): number {
    const max = Math.max(...this.teamLoad.map((item) => item.count));
    return max > 0 ? (count / max) * 100 : 0;
  }

  private parsearFecha(fechaStr: string): Date {
    if (!fechaStr) return new Date();
    const formatoIso = fechaStr.replace(' ', 'T');
    const fecha = new Date(formatoIso);
    return isNaN(fecha.getTime()) ? new Date() : fecha;
  }

  private calcularTiempoRelativo(fechaStr: string): string {
    const fecha = this.parsearFecha(fechaStr);
    const ahora = new Date();
    const difMs = ahora.getTime() - fecha.getTime();
    const difMin = Math.floor(difMs / 60000);
    const difHoras = Math.floor(difMin / 60);
    const difDias = Math.floor(difHoras / 24);

    if (difMin < 1) return 'Hace un momento';
    if (difMin < 60) return `Hace ${difMin} min`;
    if (difHoras < 24) return `Hace ${difHoras} horas`;
    return `Hace ${difDias} días`;
  }
}
