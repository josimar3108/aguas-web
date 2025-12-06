import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// Movemos las interfaces aquí para compartirlas
export interface AdminUser {
  id: number;
  nombre: string;
  rol: string;
  conectado: boolean;
  ultimaAccion: string;
  tiempoActivo: string;
}

export interface ForoRespuesta {
  autor: string;
  contenido: string;
  fecha: string;
}

export interface ForoPost {
  id: number;
  autor: string;
  titulo: string;
  contenido: string;
  fecha: string;
  respuestas: ForoRespuesta[];
}

@Injectable({
  providedIn: 'root'
})
export class ComunidadService {

  // Simulación de Base de Datos
  private mockAdmins: AdminUser[] = [
    { id: 1, nombre: 'Ian', rol: 'Super Admin', conectado: true,  ultimaAccion: 'Modificó permisos', tiempoActivo: '1h 12m' },
    { id: 2, nombre: 'Osbaldo', rol: 'Admin',       conectado: true,  ultimaAccion: 'Agregó un reporte', tiempoActivo: '43m' },
    { id: 3, nombre: 'Josimar', rol: 'Auditor',     conectado: false, ultimaAccion: 'Vio registros',    tiempoActivo: '0m' }
  ];

  private mockPosts: ForoPost[] = [
    {
      id: 1,
      autor: 'Juan',
      titulo: 'Problema con permisos',
      contenido: 'Hay un bug al asignar permisos a nuevos usuarios.',
      fecha: new Date().toLocaleString(),
      respuestas: [
        { autor: 'María', contenido: 'Ya lo reviso.', fecha: new Date().toLocaleString() }
      ]
    }
  ];

  constructor() { }

  // --- MÉTODOS PARA ADMINS ---
  getAdmins(): Observable<AdminUser[]> {
    // Simulamos un retraso de red de 500ms
    return of(this.mockAdmins).pipe(delay(500));
  }

  // --- MÉTODOS PARA EL FORO ---
  getPosts(): Observable<ForoPost[]> {
    return of(this.mockPosts).pipe(delay(500));
  }

  createPost(post: Partial<ForoPost>): Observable<ForoPost> {
    const nuevoPost: ForoPost = {
      id: this.mockPosts.length + 1,
      autor: post.autor || 'Admin',
      titulo: post.titulo!,
      contenido: post.contenido!,
      fecha: new Date().toLocaleString(), // Fecha real automática
      respuestas: []
    };
    
    // Aquí es donde en la vida real harías un POST a tu API
    this.mockPosts.unshift(nuevoPost);
    return of(nuevoPost).pipe(delay(300));
  }

  addReply(postId: number, respuesta: string, autor: string): Observable<ForoPost | undefined> {
    const post = this.mockPosts.find(p => p.id === postId);
    if (post) {
      post.respuestas.push({
        autor: autor,
        contenido: respuesta,
        fecha: new Date().toLocaleString()
      });
      return of(post).pipe(delay(300));
    }
    return of(undefined);
  }
}