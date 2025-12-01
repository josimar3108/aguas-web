import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Incident {
  id: number;
  type: string;
  description: string;
  latitude: number;
  longitude: number;
  weather: string;
  createdAt: Date;
  severity: 'Baja' | 'Media' | 'Alta';
  status: 'En proceso' | 'Reportado' | 'Controlado' | 'Resuelto';
}

@Injectable({
  providedIn: 'root'
})
export class IncidentsService {

  private baseUrl = `${environment.apiBaseUrl}/incidents`;

  private localIncidents: Incident[] = [
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

  constructor(private http: HttpClient) {}

  getNearby(lat: number, lng: number, radius: number = 3000): Observable<Incident[]> {
    const params = new HttpParams()
      .set('lat', lat)
      .set('lng', lng)
      .set('radius', radius);

    return this.http.get<Incident[]>(this.baseUrl, { params });
  }

  create(incident: Incident): Observable<Incident> {
    return this.http.post<Incident>(this.baseUrl, incident);
  }

  getAllLocal(): Incident[] {
    return [...this.localIncidents]; // copia segura
  }

  getByIdLocal(id: number): Incident | undefined {
    return this.localIncidents.find(i => i.id === id);
  }

  getBySeverity(severity: 'Baja' | 'Media' | 'Alta'): Incident[] {
    return this.localIncidents.filter(i => i.severity === severity);
  }

  getActiveAlerts(): Incident[] {
    return this.localIncidents.filter(i => i.status !== 'Resuelto');
  }
}
