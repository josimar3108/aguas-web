import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Incident } from '../Interfaces/incident.interface';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class IncidentsService {

  private baseUrl = environment.apiBaseUrl || 'http://10.151.204.19:5000';
  private readonly CLAVE_SECRETA = 'AguasMovilSeguro'; 

  constructor(private http: HttpClient) {}

  getAllReal(): Observable<Incident[]> {
    return this.http.get<string[]>(`${this.baseUrl}/obtener_reportes`).pipe(
      map(encryptedList => {
        let allIncidents: Incident[] = [];

        encryptedList.forEach(encryptedString => {
          try {
            const cleanString = encryptedString.replace(/\s/g, ''); 
            const bytes = CryptoJS.AES.decrypt(cleanString, CryptoJS.enc.Utf8.parse(this.CLAVE_SECRETA), {
              mode: CryptoJS.mode.ECB,
              padding: CryptoJS.pad.Pkcs7
            });
            
            const jsonString = bytes.toString(CryptoJS.enc.Utf8);

            if (jsonString) {
              const userReports: any[] = JSON.parse(jsonString);

              const mappedReports: Incident[] = userReports.map(r => ({
                id: r.idReporte,
                type: r.type || r.tipo,
                description: r.descripcion,
                latitude: r.datosGeo?.latitud || r.latitud || 0,
                longitude: r.datosGeo?.longitud || r.longitud || 0,
                address: r.datosGeo?.direccion || 'Ubicación GPS',
                weather: r.datosClima?.condicion || r.clima || 'Desconocido',
                temperature: r.datosClima?.temperatura, 
                fecha: r.fecha, 
                status: r.estado || 'PENDIENTE',
                severity: this.calcularSeveridad(r.type || r.tipo)
              }));

              allIncidents = [...allIncidents, ...mappedReports];
            }
          } catch (e) {
            console.error('Error procesando un paquete de datos:', e);
          }
        });

        return allIncidents;
      })
    );
  }

  private calcularSeveridad(tipo: string): string {
    if (!tipo) return 'Baja';
    const t = tipo.toLowerCase();
    if (t.includes('accidente') || t.includes('incendio') || t.includes('inundacion')) return 'Alta';
    if (t.includes('asalto') || t.includes('robo')) return 'Media';
    return 'Baja';
  }
}