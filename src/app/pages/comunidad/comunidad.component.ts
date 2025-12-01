import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface AdminUser {
  id: number;
  nombre: string;
  rol: string;
  conectado: boolean;
  ultimaAccion: string;
  tiempoActivo: string;
}

interface ForoRespuesta {
  autor: string;
  contenido: string;
  fecha: string;
}

interface ForoPost {
  id: number;
  autor: string;
  titulo: string;
  contenido: string;
  fecha: string;
  respuestas: ForoRespuesta[];
}

@Component({
  selector: 'app-comunidad',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './comunidad.component.html',
  styleUrl: './comunidad.component.scss',
})
export class ComunidadComponent {
  admins: AdminUser[] = [
    { id: 1, nombre: 'Ian', rol: 'Super Admin', conectado: true,  ultimaAccion: 'Modificó permisos', tiempoActivo: '1h 12m' },
    { id: 2, nombre: 'Osbaldo', rol: 'Admin',       conectado: true,  ultimaAccion: 'Agregó un reporte', tiempoActivo: '43m' },
    { id: 3, nombre: 'Josimar', rol: 'Auditor',     conectado: false, ultimaAccion: 'Vio registros',    tiempoActivo: '0m' }
  ];

  posts: ForoPost[] = [
    {
      id: 1,
      autor: 'Juan',
      titulo: 'Problema con permisos',
      contenido: 'Hay un bug al asignar permisos a nuevos usuarios.',
      fecha: 'Hoy 10:30 AM',
      respuestas: [
        { autor: 'María', contenido: 'Ya lo reviso.', fecha: 'Hoy 10:45 AM' }
      ]
    }
  ];

  nuevoPost: Partial<ForoPost> = {
    autor: 'Admin Actual',
    titulo: '',
    contenido: ''
  };

  crearPost() {
    const titulo = (this.nuevoPost.titulo || '').trim();
    const contenido = (this.nuevoPost.contenido || '').trim();
    if (!titulo || !contenido) return;

    const nuevo: ForoPost = {
      id: this.posts.length + 1,
      autor: this.nuevoPost.autor || 'Admin',
      titulo,
      contenido,
      fecha: 'Ahora',
      respuestas: []
    };

    this.posts.unshift(nuevo);
    this.nuevoPost = { autor: 'Admin Actual', titulo: '', contenido: '' };
  }

  responder(post: ForoPost, respuestaTexto: string) {
    const texto = (respuestaTexto || '').trim();
    if (!texto) return;

    post.respuestas.push({
      autor: 'Admin Actual',
      contenido: texto,
      fecha: 'Ahora'
    });
  }
}
