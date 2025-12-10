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
  styleUrls: ['./alertas.component.scss']
})
export class AlertasComponent implements OnInit {
  
  incidents: Incident[] = [];
  filtered: Incident[] = [];
  loading: boolean = true;

  filterType: string = '';
  searchText: string = '';

  constructor(private incidentService: IncidentsService) {}

  ngOnInit(): void {
    this.cargarAlertas();
  }

  cargarAlertas() {
    this.loading = true;
    
    this.incidentService.getAllReal().subscribe({
      next: (data) => {
        this.incidents = data.sort((a: any, b: any) => {
          const fechaA = new Date(a.fecha || 0).getTime();
          const fechaB = new Date(b.fecha || 0).getTime();
          return fechaB - fechaA;
        });

        this.filtered = [...this.incidents];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar alertas:', err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    const texto = this.searchText.toLowerCase().trim();

    this.filtered = this.incidents.filter(incident => {
      const matchType = !this.filterType || incident.type === this.filterType;

      const descripcion = incident.description ? incident.description.toLowerCase() : '';
      const direccion = incident.address ? incident.address.toLowerCase() : '';
      const tipo = incident.type ? incident.type.toLowerCase() : '';

      const matchSearch = !texto || 
                          descripcion.includes(texto) || 
                          direccion.includes(texto) || 
                          tipo.includes(texto);
      
      return matchType && matchSearch;
    });
  }

  clearFilters(): void {
    this.filterType = '';
    this.searchText = '';
    this.filtered = [...this.incidents];
  }
}