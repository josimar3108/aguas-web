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
        console.log('Lo que llega de Python:', d);
        this.accesos = d;
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
      a.event_type.toLowerCase().includes(q) || 
      a.client_ip.toLowerCase().includes(q)
    );
  }

  getStatusClass(status: string): string {
    const s = status.toLowerCase();
    if (s.includes('success')) return 'ok';
    if (s.includes('failure') || s.includes('error')) return 'bad';
    return 'warn';
  }
}