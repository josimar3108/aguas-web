import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComunidadService, AdminUser, ForoPost } from '../../services/comunidad.service';

@Component({
  selector: 'app-comunidad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comunidad.component.html',
  styleUrl: './comunidad.component.scss',
})
export class ComunidadComponent implements OnInit {

  private comunidadService = inject(ComunidadService);

  admins: AdminUser[] = [];
  posts: ForoPost[] = [];

  currentUser = 'Admin Actual';

  loading = true;

  nuevoPost: Partial<ForoPost> = {
    autor: this.currentUser,
    titulo: '',
    contenido: ''
  };

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.loading = true;

    this.comunidadService.getAdmins().subscribe(data => {
      this.admins = data;
    });

    this.comunidadService.getPosts().subscribe(data => {
      this.posts = data;
      this.loading = false;
    });
  }

  crearPost() {
    const titulo = (this.nuevoPost.titulo || '').trim();
    const contenido = (this.nuevoPost.contenido || '').trim();

    if (!titulo || !contenido) return;

    this.comunidadService.createPost({
      autor: this.currentUser,
      titulo,
      contenido
    }).subscribe({
      next: () => {
        this.nuevoPost = { autor: this.currentUser, titulo: '', contenido: '' };
        this.cargarDatos();
      },
      error: (err) => console.error('Error al crear post', err)
    });
  }

  responder(post: ForoPost, respuestaTexto: string) {
    const texto = (respuestaTexto || '').trim();
    if (!texto) return;

    this.comunidadService.addReply(post.id, texto, this.currentUser).subscribe({
      next: () => {
        console.log('Respuesta enviada');
      },
      error: (err) => console.error('Error al responder', err)
    });
  }
}
