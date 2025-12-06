import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HistorialAcceso } from '../Interfaces/historial-acceso.model';

@Injectable({
  providedIn: 'root'
})
export class AccesosService {
  private apiUrlGet = `${environment.apiBaseUrl}/obtener_accesos`;
  private apiUrlPost = `${environment.apiBaseUrl}/registrar_acceso`;

  constructor(private http: HttpClient) {}

  listarAccesos(): Observable<HistorialAcceso[]> {
    return this.http.get<HistorialAcceso[]>(this.apiUrlGet);
  }

  // IMPORTANTE: responseType: 'text' para evitar error de parsing
  registrarNuevoAcceso(datos: any): Observable<any> {
    return this.http.post(this.apiUrlPost, datos, { responseType: 'text' });
  }
}