import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HistorialAccion } from '../Interfaces/historial-accion.model';


@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  private datos: HistorialAccion[] = [
    { id: 1, fecha: new Date().toISOString(), administrador: 'Osbaldo', accion: 'update', modulo: 'Incidentes', descripcion: 'Modificó incidente #1453: Pendiente → Cerrado' },
    { id: 2, fecha: new Date(Date.now() - 1000*60*60).toISOString(), administrador: 'Ian', accion: 'create', modulo: 'Usuarios', descripcion: 'Creó usuario: pedro.perez' },
    { id: 3, fecha: new Date(Date.now() - 1000*60*60*5).toISOString(), administrador: 'Angel', accion: 'config-change', modulo: 'Sistema', descripcion: 'Actualizó parámetro: tiempo_sesion -> 30m' },
  ];

  listarAcciones(): Observable<HistorialAccion[]> {
    return of(this.datos);
  }
}
