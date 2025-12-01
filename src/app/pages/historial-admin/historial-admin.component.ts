import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistorialAccion } from '../../Interfaces/historial-accion.model';
import { HistorialAcceso } from '../../Interfaces/historial-acceso.model';
import { AuditoriaService } from '../../services/auditoria.service';
import { AccesosService } from '../../services/accesos.service';

@Component({
  selector: 'app-historial-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial-admin.component.html',
  styleUrls: ['./historial-admin.component.scss'],
})
export class HistorialAdminComponent implements OnInit {
  currentTab: 'auditoria' | 'accesos' = 'auditoria';

  acciones: HistorialAccion[] = [];
  accesos: HistorialAcceso[] = [];

  filtroAcciones = '';
  filtroAccesos = '';

  loadingAcciones = false;
  loadingAccesos = false;

  constructor(
    private auditoriaSvc: AuditoriaService,
    private accesosSvc: AccesosService
  ) {}

  ngOnInit(): void {
    this.cargarAcciones();
    this.cargarAccesos();
  }

  cambiarTab(t: 'auditoria' | 'accesos') {
    this.currentTab = t;
  }

  private cargarAcciones() {
    this.loadingAcciones = true;
    this.auditoriaSvc.listarAcciones().subscribe({
      next: (d) => {
        this.acciones = d.sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        this.loadingAcciones = false;
      },
      error: () => {
        this.loadingAcciones = false;
      },
    });
  }

  private cargarAccesos() {
    this.loadingAccesos = true;
    this.accesosSvc.listarAccesos().subscribe({
      next: (d) => {
        this.accesos = d.sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        this.loadingAccesos = false;
      },
      error: () => {
        this.loadingAccesos = false;
      },
    });
  }

  get accionesFiltradas(): HistorialAccion[] {
    const q = this.filtroAcciones.trim().toLowerCase();
    if (!q) return this.acciones;
    return this.acciones.filter((a) =>
      JSON.stringify(a).toLowerCase().includes(q)
    );
  }

  get accesosFiltrados(): HistorialAcceso[] {
    const q = this.filtroAccesos.trim().toLowerCase();
    if (!q) return this.accesos;
    return this.accesos.filter((a) =>
      JSON.stringify(a).toLowerCase().includes(q)
    );
  }

  fmtFecha(iso?: string) {
    if (!iso) return '';
    const d = new Date(iso);
    return new Intl.DateTimeFormat('es-MX', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(d);
  }

  exportCSV(data: any[], headers: string[], filename = 'export.csv') {
    if (!data || !data.length) return;
    const csvRows: string[] = [];
    csvRows.push(headers.join(','));
    for (const row of data) {
      const vals = headers.map((h) => {
        const v = row[h] ?? '';
        const str = typeof v === 'string' ? v : JSON.stringify(v);
        return `"${String(str).replace(/"/g, '""')}"`;
      });
      csvRows.push(vals.join(','));
    }
    const blob = new Blob([csvRows.join('\n')], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  descargarAccionesCSV() {
    const headers = [
      'fecha',
      'administrador',
      'accion',
      'modulo',
      'descripcion',
    ];
    const data = this.accionesFiltradas.map((r) => ({
      fecha: this.fmtFecha(r.fecha),
      administrador: r.administrador,
      accion: r.accion,
      modulo: r.modulo,
      descripcion: r.descripcion,
    }));
    this.exportCSV(data, headers, 'auditoria.csv');
  }

  descargarAccesosCSV() {
    const headers = [
      'fecha',
      'usuario',
      'ip',
      'navegador',
      'resultado',
      'intentos',
      'ubicacion',
    ];
    const data = this.accesosFiltrados.map((r) => ({
      fecha: this.fmtFecha(r.fecha),
      usuario: r.usuario,
      ip: r.ip,
      navegador: r.navegador,
      resultado: r.resultado,
      intentos: r.intentos,
      ubicacion: r.ubicacion ?? '',
    }));
    this.exportCSV(data, headers, 'accesos.csv');
  }
}
