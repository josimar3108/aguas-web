import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class ServicioUsuarios {
  private urlApi = `${environment.apiBaseUrl}/usuarios`; 

  constructor(private http: HttpClient) {}

  obtenerUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.urlApi);
  }

  crearUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(this.urlApi, usuario);
  }

  editarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put<any>(`${this.urlApi}/${id}`, usuario);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlApi}/${id}`);
  }
}