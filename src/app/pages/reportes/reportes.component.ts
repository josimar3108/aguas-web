import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Incident {
  id: number;
  type: string;
  description: string;
  latitude: number;
  longitude: number;
  weather?: string;
  createdAt?: Date;
  status?: string;
  severity?: string;
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [NgFor, NgIf, CommonModule, FormsModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss',
})
export class ReportesComponent {
  filterType: string = '';

  incidents: Incident[] = [
    {
      id: 1,
      type: 'Accidente',
      description: 'Colisión entre dos vehículos',
      latitude: 21.8818,
      longitude: -102.2916,
      weather: 'Soleado',
      createdAt: new Date(),
      severity: 'Alta',
      status: 'En proceso',
    },
    {
      id: 2,
      type: 'Incendio',
      description: 'Incendio en un lote baldío',
      latitude: 21.879,
      longitude: -102.296,
      weather: 'Nublado',
      createdAt: new Date(),
      severity: 'Media',
      status: 'Controlado',
    },
    {
      id: 3,
      type: 'Accidente',
      description: 'Motociclista derrapado en curva peligrosa',
      latitude: 21.8855,
      longitude: -102.3001,
      weather: 'Lluvioso',
      createdAt: new Date(),
      severity: 'Alta',
      status: 'Reportado',
    },
    {
      id: 4,
      type: 'Asalto',
      description: 'Robo a transeúnte en vía pública',
      latitude: 21.8701,
      longitude: -102.2803,
      weather: 'Soleado',
      createdAt: new Date(),
      severity: 'Media',
      status: 'En proceso',
    },
    {
      id: 5,
      type: 'Asalto',
      description: 'Intento de robo en tienda de conveniencia',
      latitude: 21.8779,
      longitude: -102.2847,
      weather: 'Nublado',
      createdAt: new Date(),
      severity: 'Baja',
      status: 'Resuelto',
    },
    {
      id: 6,
      type: 'Inundación',
      description: 'Calle principal con acumulación de agua',
      latitude: 21.8922,
      longitude: -102.3055,
      weather: 'Tormenta',
      createdAt: new Date(),
      severity: 'Alta',
      status: 'En proceso',
    },
    {
      id: 7,
      type: 'Inundación',
      description: 'Filtros de drenaje saturados',
      latitude: 21.8633,
      longitude: -102.2901,
      weather: 'Lluvia ligera',
      createdAt: new Date(),
      severity: 'Media',
      status: 'Controlado',
    },
    {
      id: 8,
      type: 'Incendio',
      description: 'Fuga de gas provocando incendio pequeño',
      latitude: 21.876,
      longitude: -102.2999,
      weather: 'Soleado',
      createdAt: new Date(),
      severity: 'Alta',
      status: 'En proceso',
    },
    {
      id: 9,
      type: 'Accidente',
      description: 'Atropellamiento leve de peatón',
      latitude: 21.8888,
      longitude: -102.2973,
      weather: 'Nublado',
      createdAt: new Date(),
      severity: 'Baja',
      status: 'Controlado',
    },
    {
      id: 10,
      type: 'Asalto',
      description: 'Robo de vehículo con violencia',
      latitude: 21.8895,
      longitude: -102.3102,
      weather: 'Soleado',
      createdAt: new Date(),
      severity: 'Alta',
      status: 'En proceso',
    },
  ];

  filteredIncidents: Incident[] = this.incidents;

  selectedIncident: Incident | null = null;

  applyFilter() {
    this.filteredIncidents = this.filterType
      ? this.incidents.filter((i) => i.type === this.filterType)
      : this.incidents;
  }

  showDetails(incident: Incident) {
    this.selectedIncident = incident;
  }
}
