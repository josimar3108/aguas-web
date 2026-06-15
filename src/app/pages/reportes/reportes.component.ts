import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncidentsService } from '../../services/incidents.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
})
export class ReportesComponent implements OnInit {
  filterType: string = '';
  incidents: any[] = [];
  filteredIncidents: any[] = [];
  selectedIncident: any | null = null;
  loading: boolean = false;

  categoryMap: { [key: string]: string[] } = {
    Accidente: ['accidente', 'medico', 'accident'],
    Asalto: ['asalto', 'robo', 'robbery', 'assault'],
    Inundación: ['inundación', 'inundacion', 'flood'],
    Incendio: ['incendio', 'fuego', 'fire'],
    Manifestación: ['manifestación', 'manifestacion', 'protest'],
    'Vialidad Cerrada': ['vialidad cerrada', 'bloqueo', 'road closure'],
    'Fuga de Agua': ['fuga de agua', 'fuga', 'water leak'],
  };

  reportCounters: { [key: string]: number } = {
    Todos: 0,
    Accidente: 0,
    Asalto: 0,
    Inundación: 0,
    Incendio: 0,
    Manifestación: 0,
    'Vialidad Cerrada': 0,
    'Fuga de Agua': 0,
    Otro: 0,
  };

  categoriasContadores = Object.keys(this.reportCounters);

  constructor(private incidentService: IncidentsService) {}

  ngOnInit(): void {
    this.cargarReportes();
  }

  cargarReportes() {
    this.loading = true;
    this.incidentService.getAllReal().subscribe({
      next: (data) => {
        const safeData = data || [];
        this.incidents = safeData.sort((a: any, b: any) => {
          const dateA = new Date(a.fecha || 0).getTime();
          const dateB = new Date(b.fecha || 0).getTime();
          return dateB - dateA;
        });

        this.filteredIncidents = [...this.incidents];
        this.calcularContadores();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando reportes:', err);
        this.loading = false;
      },
    });
  }

  calcularContadores() {
    Object.keys(this.reportCounters).forEach(
      (k) => (this.reportCounters[k] = 0),
    );
    this.reportCounters['Todos'] = this.incidents.length;

    this.incidents.forEach((inc) => {
      const tipo = (inc.tipo || inc.type || '').toString().toLowerCase().trim();
      let encontrado = false;

      for (const [categoria, terminos] of Object.entries(this.categoryMap)) {
        if (terminos.includes(tipo)) {
          this.reportCounters[categoria]++;
          encontrado = true;
          break;
        }
      }

      if (!encontrado) {
        this.reportCounters['Otro']++;
      }
    });
  }

  setFilter(type: string) {
    this.filterType = type === 'Todos' ? '' : type;
    this.applyFilter();
  }

  applyFilter() {
    this.closeDetails();

    if (this.filterType === '') {
      this.filteredIncidents = [...this.incidents];
    } else if (this.filterType === 'Otro') {
      const todosLosTerminosConocidos = Object.values(this.categoryMap).flat();

      this.filteredIncidents = this.incidents.filter((inc) => {
        const tipo = (inc.tipo || inc.type || '')
          .toString()
          .toLowerCase()
          .trim();
        return !todosLosTerminosConocidos.includes(tipo);
      });
    } else {
      const validTypes = this.categoryMap[this.filterType] || [];
      this.filteredIncidents = this.incidents.filter((inc) => {
        const tipo = (inc.tipo || inc.type || '')
          .toString()
          .toLowerCase()
          .trim();
        return (
          validTypes.includes(tipo) || tipo === this.filterType.toLowerCase()
        );
      });
    }
  }

  showDetails(incident: any) {
    this.selectedIncident = incident;
    setTimeout(() => {
      const detailsElement = document.getElementById('detailsView');
      if (detailsElement) {
        detailsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  closeDetails() {
    this.selectedIncident = null;
  }
}
