import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistorialAcceso } from '../../Interfaces/historial-acceso.model';
import { AccesosService } from '../../services/accesos.service';

@Component({
  selector: 'app-historial-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial-admin.component.html',
  styleUrls: ['./historial-admin.component.scss'],
})
export class HistorialAdminComponent implements OnInit {
  accesos: HistorialAcceso[] = [];
  filtroAccesos = '';
  loadingAccesos = false;

  constructor(private accesosSvc: AccesosService) {}

  ngOnInit(): void {
    this.cargarAccesos();
  }

  private cargarAccesos() {
    this.loadingAccesos = true;
    this.accesosSvc.listarAccesos().subscribe({
      next: (d) => {
        console.log('Datos recibidos del historial:', d);

        this.accesos = d.sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        );
        this.loadingAccesos = false;
      },
      error: (e) => {
        console.error('Error cargando historial', e);
        this.loadingAccesos = false;
      },
    });
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
    return new Date(iso).toLocaleString('es-MX');
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
