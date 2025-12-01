import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HistorialAcceso } from '../Interfaces/historial-acceso.model';


@Injectable({
  providedIn: 'root'
})
export class AccesosService {
  private datos: HistorialAcceso[] = [
    { id: 1, fecha: new Date().toISOString(), usuario: 'juan', ip: '192.168.1.10', navegador: 'Chrome 118 (Win10)', resultado: 'exitoso', intentos: 1, ubicacion: 'Aguascalientes, MX' },
    { id: 2, fecha: new Date(Date.now() - 10*60*1000).toISOString(), usuario: 'maria', ip: '185.24.12.7', navegador: 'Firefox 124 (Linux)', resultado: 'fallido', intentos: 2 },
    { id: 3, fecha: new Date(Date.now() - 24*60*60*1000).toISOString(), usuario: 'luis', ip: '203.0.113.45', navegador: 'Safari (iOS)', resultado: 'bloqueado', intentos: 5 },
  ];

  listarAccesos(): Observable<HistorialAcceso[]> {
    return of(this.datos);
  }
}
