import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HistorialAcceso } from '../Interfaces/historial-acceso.model';

@Injectable({
  providedIn: 'root'
})
export class AccesosService {
  // Definimos la base, no la ruta final, para evitar confusiones
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // CORRECCIÓN: Apunta directamente a /logs
  listarAccesos(): Observable<HistorialAcceso[]> {
    return this.http.get<HistorialAcceso[]>(`${this.apiUrl}/logs`); 
  }

  // CORRECCIÓN: Apunta directamente a /accesos (tal cual definiste en Python)
  registrarIntento(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/accesos`, data);
  }
}