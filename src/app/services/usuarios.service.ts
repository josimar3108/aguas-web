import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// Asegúrate de que la ruta a environment sea la correcta
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class ServicioUsuarios {
  
  // La URL base termina siendo: http://localhost:5000/api/usuarios
  private urlApi = `${environment.apiBaseUrl}/usuarios`; 

  constructor(private http: HttpClient) {}

  // 1. GET: Obtener lista
  obtenerUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.urlApi);
  }

  // 2. POST: Crear nuevo usuario
  crearUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(this.urlApi, usuario);
  }

  // 3. PUT: Editar usuario existente
  // Se concatena el ID a la URL: .../api/usuarios/123
  editarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put<any>(`${this.urlApi}/${id}`, usuario);
  }

  // 4. DELETE: Eliminar usuario
  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlApi}/${id}`);
  }
}