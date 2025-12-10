import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { FormsModule } from '@angular/forms';
import { IncidentsService } from '../../services/incidents.service';
import { Incident } from '../../Interfaces/incident.interface';

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, FormsModule],
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss'],
})
export class MapPageComponent implements OnInit {
  center: google.maps.LatLngLiteral = { lat: 21.8853, lng: -102.2916 };
  zoom = 13;

  realIncidents: Incident[] = [];
  textoBusqueda: string = '';

  constructor(private incidentsSvc: IncidentsService) {}

  ngOnInit(): void {
    this.cargarIncidentesReales();
  }

  cargarIncidentesReales() {
    this.incidentsSvc.getAllReal().subscribe({
      next: (data) => {
        this.realIncidents = data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  buscarLugar() {
    if (!this.textoBusqueda.trim()) return;

    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ address: this.textoBusqueda }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        const ubicacion = results[0].geometry.location;
        
        this.center = {
          lat: ubicacion.lat(),
          lng: ubicacion.lng()
        };
        this.zoom = 15; 
      } else {
        alert('No se pudo encontrar el lugar');
      }
    });
  }

  flyTo(lat: number, lng: number) {
    this.center = { lat, lng };
    this.zoom = 18;
  }

  irAmiUbicacion() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (posicion) => {
          this.center = {
            lat: posicion.coords.latitude,
            lng: posicion.coords.longitude,
          };
          this.zoom = 15;
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  getMarkerOptions(type: string): google.maps.MarkerOptions {
    return { title: type };
  }

  obtenerIcono(tipoRecibido: string): google.maps.Icon | google.maps.Symbol {
    const tipo = tipoRecibido
      ? tipoRecibido.toLowerCase().trim()
      : 'desconocido';

    let ruta = '';
    let color = '';

    const iconoPolicia =
      'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z';
    const iconoFuego =
      'M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z';
    const iconoSalud =
      'M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z';
    const iconoAgua =
      'M12 22c4.97 0 9-4.03 9-9 0-4.97-9-13-9-13S3 8.03 3 13c0 4.97 4.03 9 9 9z';
    const iconoGrupo =
      'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z';
    const iconoBloqueo =
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z';
    const iconoDefault =
      'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z';

    switch (tipo) {
      case 'asalto':
      case 'robo': {
        ruta = iconoPolicia;
        color = '#1E88E5';
        break;
      }

      case 'incendio':
      case 'fuego': {
        ruta = iconoFuego;
        color = '#D50000';
        break;
      }

      case 'accidente':
      case 'medico': {
        ruta = iconoSalud;
        color = '#00C853';
        break;
      }

      case 'inundación':
      case 'inundacion': {
        ruta = iconoAgua;
        color = '#00BCD4';
        break;
      }

      case 'fuga de agua':
      case 'fuga': {
        ruta = iconoAgua;
        color = '#0288D1';
        break;
      }

      case 'manifestación':
      case 'manifestacion': {
        ruta = iconoGrupo;
        color = '#FF9800';
        break;
      }

      case 'vialidad cerrada':
      case 'bloqueo': {
        ruta = iconoBloqueo;
        color = '#424242';
        break;
      }

      default: {
        ruta = iconoDefault;
        color = '#757575';
        break;
      }
    }

    return {
      path: ruta,
      fillColor: color,
      fillOpacity: 1,
      strokeWeight: 1,
      strokeColor: '#FFFFFF',
      rotation: 0,
      scale: 1.2,
      anchor: new google.maps.Point(12, 12),
    };
  }
}