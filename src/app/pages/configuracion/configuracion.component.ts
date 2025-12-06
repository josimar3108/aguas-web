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
export class ConfiguracionComponent implements OnInit
{
  //Variables de gestión de usuarios
  usuarios: any[] = []; //users
  usuarioSeleccionado: any = null; //selectedUser
  mostrarModalUsuario = false; //showUserModal
  usuarioNuevo = false; //newUser
  
  //Variable temporal para password nuevo
  passwordNuevo = ''; //newPassword 
  
  //Variables para gestión de respaldos (Backups)
  copiasDeSeguridad: any[] = [ //backups (Ejemplo de datos para que funcione el *ngFor)
    { id: 1, fecha: '2025-12-05 03:00', nombreArchivo: 'backup_20251205.sql' },
    { id: 2, fecha: '2025-12-04 03:00', nombreArchivo: 'backup_20251204.sql' },
  ];
  
  respaldoAutomatico = { //autoBackup
    habilitado: false, //enabled
    frecuencia: 'diario', //frecuencia
    hora: '03:00', //hora
  };

  constructor(private usuariosService: ServicioUsuarios)
  {
  }

  ngOnInit()
  {
    this.cargarUsuarios();
  }

  cargarUsuarios()
  {
    this.usuariosService.obtenerUsuarios().subscribe({
      next: (data) =>
      {
        this.usuarios = data; //users
      },
      error: (e) => console.error(e)
    });
  }

  openUserModal(usuario: any = null) //openUserModal(user)
  {
    this.usuarioNuevo = usuario === null; //newUser
    this.passwordNuevo = ''; //newPassword Resetear password field
    
    if (this.usuarioNuevo)
    {
      this.usuarioSeleccionado = { nombre: '', rol: 'Operador', activo: true }; //selectedUser
    }
    else
    {
      this.usuarioSeleccionado = { ...usuario }; //selectedUser
    }
    this.mostrarModalUsuario = true; //showUserModal
  }

  saveUser()
  {
    if (this.usuarioNuevo)
    {
      //Validar que tenga password al crear
      if (!this.passwordNuevo) {
          alert("Debes asignar una contraseña al nuevo usuario");
          return;
      }
      
      const usuarioNuevo = { ...this.usuarioSeleccionado, password: this.passwordNuevo }; //selectedUser, newPassword
      
      this.usuariosService.crearUsuario(usuarioNuevo).subscribe(() =>
      {
        this.cargarUsuarios();
        this.mostrarModalUsuario = false; //showUserModal
      });
    }
    else
    {
      this.usuariosService.editarUsuario(this.usuarioSeleccionado.id, this.usuarioSeleccionado).subscribe(() => //selectedUser
      {
        this.cargarUsuarios();
        this.mostrarModalUsuario = false; //showUserModal
      });
    }
  }

  deleteUser(id: number)
  {
    if(confirm("¿Estás seguro de eliminar este usuario?"))
    {
        this.usuariosService.eliminarUsuario(id).subscribe(() =>
        {
          this.cargarUsuarios();
        });
    }
  }

  //MÉTODO AGREGADO: forcePasswordReset
  forcePasswordReset(usuario: any): void
  {
    //Implementar la llamada al servicio para forzar el reinicio de la contraseña del usuario
    console.log('Reiniciando contraseña para el usuario:', usuario.nombre);
    alert(`Contraseña de ${usuario.nombre} ha sido reiniciada (Implementar lógica real).`);
  }

  generateBackup()
  {
    //Implementar lógica de generar respaldo
    alert('Respaldo generado correctamente.');
  }

  uploadBackup(event: any)
  {
    const archivo = event.target.files[0]; //file
    if (archivo) alert('Respaldo cargado: ' + archivo.name);
  }

  restoreBackup(copiaDeSeguridad: any) //backup
  {
    if (confirm(`¿Restaurar respaldo del ${copiaDeSeguridad.fecha}?`))
    {
      //Implementar lógica de restauración
      alert('Sistema restaurado.');
    }
  }
}