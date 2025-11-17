import { Component, OnInit } from '@angular/core';

// Google Maps
import { GoogleMap, MapMarker } from '@angular/google-maps';

// Directivas y pipes de Angular
import { NgIf, NgForOf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Servicio de incidentes
import { IncidentsService, Incident } from '../../incidents.service'; // <-- ajusta la ruta si es diferente

@Component({
  selector: 'app-map-page',
  standalone: true,
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss'],
  // 👇 AQUÍ se arreglan casi todos los errores
  imports: [
    GoogleMap,
    MapMarker,
    NgIf,
    NgForOf,
    FormsModule,
    DatePipe
  ]
})
export class MapPageComponent implements OnInit {

  center: google.maps.LatLngLiteral = { lat: 21.8853, lng: -102.2916 };
  zoom = 13;

  incidents: Incident[] = [];
  filterType: string = 'Todos';
  selectedIncident?: Incident;

  constructor(private incidentsService: IncidentsService) {}

  ngOnInit(): void {
    this.loadIncidents();
  }

  loadIncidents() {
    const { lat, lng } = this.center;
    this.incidentsService.getNearby(lat, lng, 5000)
      .subscribe(res => {
        this.incidents = res;
      });
  }

  onMarkerClick(incident: Incident) {
    this.selectedIncident = incident;
  }

  applyFilter() {
    if (this.filterType === 'Todos') {
      this.loadIncidents();
      return;
    }
    this.incidents = this.incidents.filter(i => i.type === this.filterType);
  }
}
