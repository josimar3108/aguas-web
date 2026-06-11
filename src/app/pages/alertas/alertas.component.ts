import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncidentsService } from '../../services/incidents.service';
import { Incident } from '../../Interfaces/incident.interface';

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.scss'],
})
export class AlertasComponent implements OnInit {
  incidents: Incident[] = [];
  filtered: Incident[] = [];
  loading: boolean = true;
  filterType: string = '';
  searchText: string = '';

  categoryMap: { [key: string]: string[] } = {
    Accidente: ['accidente', 'medico', 'accident'],
    Asalto: ['asalto', 'robo', 'robbery', 'assault'],
    Inundación: ['inundación', 'inundacion', 'flood'],
    Incendio: ['incendio', 'fuego', 'fire'],
    Manifestación: ['manifestación', 'manifestacion', 'protest'],
    'Vialidad Cerrada': ['vialidad cerrada', 'bloqueo', 'road closure'], // Espacio correcto
    'Fuga de Agua': ['fuga de agua', 'fuga', 'water leak'], // Espacio correcto
  };

  // Se agregó 'Total' aquí para que no marque error al asignarlo después
  statusCounters: { [key: string]: number } = {
    Pendiente: 0,
    'En Progreso': 0,
    Activo: 0,
    Resuelto: 0,
    Total: 0,
  };

  constructor(private incidentService: IncidentsService) {}

  ngOnInit(): void {
    this.cargarAlertas();
  }

  cargarAlertas() {
    this.loading = true;
    this.incidentService.getAllReal().subscribe({
      next: (data) => {
        this.incidents = data.sort(
          (a: any, b: any) =>
            new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
        );
        this.filtered = [...this.incidents];
        this.calcularContadores();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  calcularContadores() {
    this.statusCounters = {
      Pendiente: 0,
      'En Progreso': 0,
      Activo: 0,
      Resuelto: 0,
      Total: this.incidents.length,
    };

    this.incidents.forEach((inc) => {
      // Normalizamos a mayúsculas para evitar errores de comparación
      const st = (inc.status || '').toUpperCase().trim();

      // Ajustamos los comparadores según los datos reales de tu SQL
      if (st.includes('PEND')) {
        this.statusCounters['Pendiente']++;
      } else if (st.includes('PROG')) {
        this.statusCounters['En Progreso']++;
      } else if (st === 'ACTIVE' || st === 'ACTIVO') {
        // Aceptamos tanto el término en inglés (tu SQL) como en español
        this.statusCounters['Activo']++;
      } else if (st.includes('RESU') || st.includes('RESOL')) {
        this.statusCounters['Resuelto']++;
      }
    });
  }

  // --- FUNCIÓN ÚNICA (Se eliminó la duplicada) ---
  getDisplayStatus(st: string): string {
    const s = (st || '').toUpperCase().trim();
    if (s.includes('PEND')) return 'PENDIENTE';
    if (s.includes('PROG')) return 'EN PROGRESO';
    if (s.includes('ACTI')) return 'ACTIVO';
    if (s.includes('RESU') || s.includes('RESOL')) return 'RESUELTO';
    return s;
  }

  applyFilters(): void {
    const texto = this.searchText.toLowerCase().trim();
    const todosLosTerminos = Object.values(this.categoryMap).flat();

    this.filtered = this.incidents.filter((i) => {
      const tipo = (i.type || '').toLowerCase().trim();
      const matchType = !this.filterType
        ? true
        : this.filterType === 'Otro'
          ? !todosLosTerminos.includes(tipo)
          : (this.categoryMap[this.filterType] || []).includes(tipo) ||
            tipo === this.filterType.toLowerCase();

      const matchSearch =
        !texto ||
        (i.description || '').toLowerCase().includes(texto) ||
        (i.address || '').toLowerCase().includes(texto);
      return matchType && matchSearch;
    });
  }

  clearFilters(): void {
    this.filterType = '';
    this.searchText = '';
    this.filtered = [...this.incidents];
  }

  getSeverityClass(typeStr: string): string {
    const t = (typeStr || '').toLowerCase().trim();
    const altas = [
      ...this.categoryMap['Accidente'],
      ...this.categoryMap['Asalto'],
      ...this.categoryMap['Inundación'],
      ...this.categoryMap['Incendio'],
    ];
    return altas.includes(t) ? 'severity-high' : 'severity-low';
  }
}
