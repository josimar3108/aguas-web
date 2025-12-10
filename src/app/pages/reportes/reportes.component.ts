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
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando reportes:', err);
        this.loading = false;
      },
    });
  }

  applyFilter() {
    this.closeDetails();

    if (this.filterType === '') {
      this.filteredIncidents = [...this.incidents];
    } else {
      this.filteredIncidents = this.incidents.filter((inc) => {
        const tipo = inc.tipo || inc.type || '';
        return tipo.toString().toLowerCase() === this.filterType.toLowerCase();
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
