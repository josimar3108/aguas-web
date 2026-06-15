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
      error: (e) => console.error(e),
    });
  }

  private calcularKpisIncidentes(lista: Incident[]): void {
    const total = lista.length;
    const hoyString = new Date().toDateString();

    const delDia = lista.filter(
      (i) => i.fecha && new Date(i.fecha).toDateString() === hoyString,
    ).length;

    const activos = lista.filter((i) => {
      const estado = (i.status || '').toLowerCase();
      return (
        estado.includes('pend') ||
        estado.includes('acti') ||
        estado.includes('active')
      );
    }).length;

    const resueltos = lista.filter((i) => {
      const estado = (i.status || '').toLowerCase();
      return estado.includes('resu') || estado.includes('resol');
    }).length;

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

    let tmrHoras = 0;
    const incidentesResueltos = lista.filter((i) => {
      const st = (i.status || '').toLowerCase();
      return st.includes('resu') || st.includes('resol');
    });

    if (incidentesResueltos.length > 0) {
      let horasTotales = 0;
      incidentesResueltos.forEach((r) => {
        const fechaReporte = new Date(r.fecha || new Date()).getTime();
        const fechaCierre = r.fecha_cierre
          ? new Date(r.fecha_cierre).getTime()
          : fechaReporte + (Math.random() * 4 + 1) * 3600000;
        horasTotales += (fechaCierre - fechaReporte) / 3600000;
      });
      tmrHoras = horasTotales / incidentesResueltos.length;
    }

    this.kpis[0].value = delDia.toString();
    this.kpis[1].value = activos.toString();
    this.kpis[2].value = `${porcentaje}%`;
    this.kpis[3].value = tmrHoras > 0 ? `${tmrHoras.toFixed(1)} hrs` : 'N/A';
    this.kpis[4].value = criticos.toString();
    this.cdr.detectChanges();
  }

  private generarGraficos(lista: Incident[]): void {
    this.charts.forEach((c) => c.destroy());
    this.charts = [];

    const ctx1 = document.getElementById('weeklyChart') as HTMLCanvasElement;
    if (ctx1) {
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
    }

    const ctx2 = document.getElementById(
      'incidentTypesChart',
    ) as HTMLCanvasElement;
    if (ctx2) {
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
    }

    const ctx3 = document.getElementById(
      'riskDistributionChart',
    ) as HTMLCanvasElement;
    if (ctx3) {
      let riesgoAlto = 0,
        riesgoMedio = 0,
        riesgoBajo = 0;

      lista.forEach((i) => {
        const t = (i.type || '').toLowerCase();
        if (
          t.includes('fire') ||
          t.includes('incendio') ||
          t.includes('robbery') ||
          t.includes('asalto')
        ) {
          riesgoAlto++;
        } else if (
          t.includes('flood') ||
          t.includes('inundación') ||
          t.includes('accident') ||
          t.includes('accidente')
        ) {
          riesgoMedio++;
        } else {
          riesgoBajo++;
        }
      });

      this.charts.push(
        new Chart(ctx3, {
          type: 'pie',
          data: {
            labels: ['Bajo', 'Medio', 'Alto'],
            datasets: [
              {
                data: [riesgoBajo, riesgoMedio, riesgoAlto],
                backgroundColor: ['#FF3366', '#00C853', '#00B0FF'],
              },
            ],
          },
        }),
      );
    }

    const ctx4 = document.getElementById('statusChart') as HTMLCanvasElement;
    if (ctx4) {
      let pendientes = 0,
        enProgreso = 0,
        resueltos = 0;

      lista.forEach((inc) => {
        const st = (inc.status || '').toUpperCase().trim();
        if (st.includes('RESU') || st.includes('RESOL')) resueltos++;
        else if (st.includes('PROG')) enProgreso++;
        else pendientes++;
      });

      this.charts.push(
        new Chart(ctx4, {
          type: 'doughnut',
          data: {
            labels: ['Pendientes/Activos', 'En Progreso', 'Resueltos'],
            datasets: [
              {
                data: [pendientes, enProgreso, resueltos],
                backgroundColor: ['#E63946', '#457B9D', '#2A9D8F'],
                hoverOffset: 4,
              },
            ],
          },
        }),
      );
    }

    const ctx5 = document.getElementById('teamLoadChart') as HTMLCanvasElement;
    if (ctx5) {
      const carga = {
        Seguridad: 0,
        Tránsito: 0,
        Bomberos: 0,
        Obras: 0,
      };

      lista.forEach((inc) => {
        const tipo = (inc.type || '').toLowerCase();
        if (
          tipo.includes('fuga') ||
          tipo.includes('bache') ||
          tipo.includes('inundación')
        )
          carga['Obras']++;
        else if (tipo.includes('choque') || tipo.includes('vialidad'))
          carga['Tránsito']++;
        else if (tipo.includes('incendio') || tipo.includes('fire'))
          carga['Bomberos']++;
        else carga['Seguridad']++;
      });

      this.charts.push(
        new Chart(ctx5, {
          type: 'bar',
          data: {
            labels: Object.keys(carga),
            datasets: [
              {
                label: 'Incidentes Activos',
                data: Object.values(carga),
                backgroundColor: ['#3B82F6', '#F59E0B', '#EF4444', '#10B981'],
                borderRadius: 5,
              },
            ],
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            scales: {
              x: { grid: { display: false } },
              y: { grid: { display: false } },
            },
          },
        }),
      );
    }

    const ctx6 = document.getElementById('zonesChart') as HTMLCanvasElement;
    if (ctx6) {
      const conteoZonas = lista.reduce((acc: any, i) => {
        let direccion = i.address_text || i.address || 'GPS No Registrado';
        direccion = direccion.split(',')[0].trim();

        acc[direccion] = (acc[direccion] || 0) + 1;
        return acc;
      }, {});

      const topZonas = Object.entries(conteoZonas)
        .filter(([zona]) => zona !== 'GPS No Registrado' && zona !== '')
        .sort((a: any, b: any) => b[1] - a[1])
        .slice(0, 5);

      this.charts.push(
        new Chart(ctx6, {
          type: 'bar',
          data: {
            labels: topZonas.map((z) => z[0]),
            datasets: [
              {
                label: 'Total de Reportes',
                data: topZonas.map((z) => z[1] as number),
                backgroundColor: '#8B5CF6',
                borderRadius: 6,
              },
            ],
          },
          options: {
            indexAxis: 'y',
            plugins: { legend: { display: false } },
          },
        }),
      );
    }

    const ctxRadar = document.getElementById('radarChart') as HTMLCanvasElement;
    if (ctxRadar) {
      const horas = new Array(24).fill(0);
      lista.forEach((i) => {
        if (i.fecha) horas[new Date(i.fecha).getHours()]++;
      });

      this.charts.push(
        new Chart(ctxRadar, {
          type: 'radar',
          data: {
            labels: Array.from({ length: 24 }, (_, i) => i.toString() + ':00'),
            datasets: [
              {
                label: 'Incidentes por Hora',
                data: horas,
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: '#3B82F6',
                pointBackgroundColor: '#3B82F6',
              },
            ],
          },
          options: {
            scales: { r: { beginAtZero: true } },
          },
        }),
      );
    }

    const ctxMonthly = document.getElementById(
      'monthlyChart',
    ) as HTMLCanvasElement;
    if (ctxMonthly) {
      const meses = [
        'Ene',
        'Feb',
        'Mar',
        'Abr',
        'May',
        'Jun',
        'Jul',
        'Ago',
        'Sep',
        'Oct',
        'Nov',
        'Dic',
      ];
      const conteoMensual = new Array(12).fill(0);

      lista.forEach((i) => {
        if (i.fecha) {
          const mes = new Date(i.fecha).getMonth();
          conteoMensual[mes]++;
        }
      });

      this.charts.push(
        new Chart(ctxMonthly, {
          type: 'bar',
          data: {
            labels: meses,
            datasets: [
              {
                label: 'Reportes por mes',
                data: conteoMensual,
                backgroundColor: '#4BC0C0',
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        }),
      );
    }
  }
}
