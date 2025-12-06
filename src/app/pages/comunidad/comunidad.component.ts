import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core'; // Importamos OnInit e inject
import { FormsModule } from '@angular/forms';
// Importa el servicio y las interfaces desde el archivo que creamos arriba
import { ComunidadService, AdminUser, ForoPost } from '../../services/comunidad.service';

@Component({
  selector: 'app-comunidad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comunidad.component.html',
  styleUrl: './comunidad.component.scss',
})
export class ComunidadComponent implements OnInit {
  
  // Inyección de dependencias moderna (Angular 16+)
  private comunidadService = inject(ComunidadService);

  // Datos
  admins: AdminUser[] = [];
  posts: ForoPost[] = [];
  
  // Usuario actual (Simulado, esto vendría de un AuthService)
  currentUser = 'Admin Actual'; 

  loading = true; // Para mostrar feedback de carga

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
    
    // Suscribirse a los admins
    this.comunidadService.getAdmins().subscribe(data => {
      this.admins = data;
    });

    // Suscribirse a los posts
    this.comunidadService.getPosts().subscribe(data => {
      this.posts = data;
      this.loading = false;
    });
  }

  crearPost() {
    const titulo = (this.nuevoPost.titulo || '').trim();
    const contenido = (this.nuevoPost.contenido || '').trim();

    if (!titulo || !contenido) return;

    // Llamamos al servicio
    this.comunidadService.createPost({
      autor: this.currentUser,
      titulo,
      contenido
    }).subscribe({
      next: (postCreado) => {
        // Al recibir respuesta exitosa, limpiamos el formulario
        // Nota: Como estamos usando arrays en memoria en el servicio, 
        // la lista 'posts' ya se actualizó por referencia, pero es buena práctica recargar
        // o insertar manualmente si fuera una API real.
        this.nuevoPost = { autor: this.currentUser, titulo: '', contenido: '' };
        
        // OPCIONAL: Si la API devuelve el post nuevo, lo agregamos arriba para verlo al instante
        // Si usamos el servicio mockeado tal cual está, esto podría duplicarlo visualmente 
        // si no refrescamos 'this.posts', pero para este ejemplo, refrescaremos la lista:
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
        // La respuesta se agregó en el servicio, Angular detectará el cambio
        // si los objetos mantienen la referencia.
        console.log('Respuesta enviada');
      },
      error: (err) => console.error('Error al responder', err)
    });
  }
}