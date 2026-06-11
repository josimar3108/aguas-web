import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServicioUsuarios } from '../../services/usuarios.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.scss',
})
export class ConfiguracionComponent implements OnInit {
  usuarios: any[] = [];
  usuariosFiltrados: any[] = []; // Nueva lista
  filtroRol: string = 'todos'; // Variable del filtro

  usuarioSeleccionado: any = null;
  mostrarModalUsuario = false;
  usuarioNuevo = false;
  passwordNuevo = '';

  copiasDeSeguridad: any[] = [
    { id: 1, fecha: '2025-12-05 03:00', tamano: '1.2GB', tipo: 'Completo' },
    { id: 2, fecha: '2025-12-04 03:00', tamano: '800MB', tipo: 'Incremental' },
  ];

  respaldoAutomatico = {
    habilitado: false,
    frecuencia: 'diario',
    hora: '03:00',
  };

  constructor(private usuariosService: ServicioUsuarios) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuariosService.obtenerUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        // Esto te mostrará en la consola del navegador qué roles existen realmente
        console.log('Roles detectados en BD:', [
          ...new Set(data.map((u) => u.rol)),
        ]);
        this.filtrarUsuarios();
      },
    });
  }

  // Lógica del filtro
  filtrarUsuarios() {
    if (this.filtroRol === 'todos') {
      this.usuariosFiltrados = [...this.usuarios];
    } else {
      // Aquí filtramos comparando directamente con 'Admin' o 'Citizen'
      this.usuariosFiltrados = this.usuarios.filter(
        (u) => u.rol === this.filtroRol,
      );
    }
  }

  openUserModal(usuario: any = null) {
    this.usuarioNuevo = usuario === null;
    this.passwordNuevo = '';
    this.usuarioSeleccionado = this.usuarioNuevo
      ? { nombre: '', rol: 'Operador', activo: true }
      : { ...usuario };
    this.mostrarModalUsuario = true;
  }

  saveUser() {
    if (this.usuarioNuevo) {
      this.usuariosService
        .crearUsuario({
          ...this.usuarioSeleccionado,
          password: this.passwordNuevo,
        })
        .subscribe(() => {
          this.cargarUsuarios();
          this.mostrarModalUsuario = false;
        });
    } else {
      this.usuariosService
        .editarUsuario(this.usuarioSeleccionado.id, this.usuarioSeleccionado)
        .subscribe(() => {
          this.cargarUsuarios();
          this.mostrarModalUsuario = false;
        });
    }
  }

  deleteUser(id: number) {
    if (confirm('¿Eliminar usuario?')) {
      this.usuariosService
        .eliminarUsuario(id)
        .subscribe(() => this.cargarUsuarios());
    }
  }

  forcePasswordReset(usuario: any): void {
    console.log('Reiniciando contraseña para el usuario:', usuario.nombre);
    alert(
      `Contraseña de ${usuario.nombre} ha sido reiniciada (Implementar lógica real).`,
    );
  }

  generateBackup() {
    alert('Respaldo generado correctamente.');
  }

  uploadBackup(event: any) {
    const archivo = event.target.files[0];
    if (archivo) alert('Respaldo cargado: ' + archivo.name);
  }

  restoreBackup(copiaDeSeguridad: any) {
    if (confirm(`¿Restaurar respaldo del ${copiaDeSeguridad.fecha}?`)) {
      alert('Sistema restaurado.');
    }
  }
}
