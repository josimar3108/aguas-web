import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Incident {
  id?: string;
  type: string;
  description: string;
  latitude: number;
  longitude: number;
  weather?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class IncidentsService {

  private baseUrl = `${environment.apiBaseUrl}/incidents`;

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
}
