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
  usuarioSeleccionado: any = null;
  mostrarModalUsuario = false;
  usuarioNuevo = false;
  passwordNuevo = '';

  copiasDeSeguridad: any[] = [
    { id: 1, fecha: '2025-12-05 03:00', nombreArchivo: 'backup_20251205.sql' },
    { id: 2, fecha: '2025-12-04 03:00', nombreArchivo: 'backup_20251204.sql' },
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
      },
      error: (e) => console.error(e),
    });
  }

  openUserModal(usuario: any = null) {
    this.usuarioNuevo = usuario === null;
    this.passwordNuevo = '';

    if (this.usuarioNuevo) {
      this.usuarioSeleccionado = { nombre: '', rol: 'Operador', activo: true };
    } else {
      this.usuarioSeleccionado = { ...usuario };
    }

    this.mostrarModalUsuario = true;
  }

  saveUser() {
    if (this.usuarioNuevo) {
      if (!this.passwordNuevo) {
        alert('Debes asignar una contraseña al nuevo usuario');
        return;
      }

      const usuarioNuevo = {
        ...this.usuarioSeleccionado,
        password: this.passwordNuevo,
      };

      this.usuariosService.crearUsuario(usuarioNuevo).subscribe(() => {
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
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuariosService.eliminarUsuario(id).subscribe(() => {
        this.cargarUsuarios();
      });
    }
  }

  forcePasswordReset(usuario: any): void {
    console.log('Reiniciando contraseña para el usuario:', usuario.nombre);
    alert(
      `Contraseña de ${usuario.nombre} ha sido reiniciada (Implementar lógica real).`
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
