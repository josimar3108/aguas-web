import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ServicioUsuarios } from '../../services/usuarios.service';
import { AccesosService } from '../../services/accesos.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  formularioLogin: FormGroup;
  mensajeError: string = '';

  constructor(
    private enrutador: Router,
    private servicioUsuarios: ServicioUsuarios,
    private servicioAccesos: AccesosService,
    private constructorFormulario: FormBuilder
  ) {
    this.formularioLogin = this.constructorFormulario.group({
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required],
    });
  }

  iniciarSesion() {
    if (this.formularioLogin.invalid) {
      this.mensajeError = 'Por favor completa todos los campos.';
      return;
    }

    const { usuario, contrasena } = this.formularioLogin.value;

    this.servicioUsuarios.obtenerUsuarios().subscribe(
      (listaUsuarios: any[]) => {
        console.log('Usuarios obtenidos:', listaUsuarios);

        const usuarioEncontrado = listaUsuarios.find((u) => {
          const nombreUsuario = u.usuario || u.username || u.nombre;
          const correoUsuario = u.correo || u.email;
          return nombreUsuario === usuario || correoUsuario === usuario;
        });

        if (usuarioEncontrado) {
          const rol = usuarioEncontrado.rol || usuarioEncontrado.role || '';
          const passReal =
            usuarioEncontrado.password || usuarioEncontrado.contrasena || '';

          const idUsuarioLog =
            usuarioEncontrado.correo || usuarioEncontrado.email || usuario;

          if (
            rol.toLowerCase() === 'administrador' ||
            rol.toLowerCase() === 'admin'
          ) {
            if (String(passReal) === String(contrasena)) {
              this.registrarIntento(idUsuarioLog, 'exitoso');

              localStorage.setItem(
                'usuarioSesion',
                JSON.stringify(usuarioEncontrado)
              );

              this.enrutador.navigate(['/home']);
            } else {
              this.mensajeError = 'Contraseña incorrecta.';
              this.registrarIntento(idUsuarioLog, 'fallido (pass)');
            }
          } else {
            this.mensajeError = 'Acceso denegado: Solo administradores.';
            this.registrarIntento(idUsuarioLog, 'fallido (rol)');
          }
        } else {
          this.mensajeError = 'Usuario no encontrado.';
          this.registrarIntento(usuario, 'fallido (no existe)');
        }
      },
      (error) => {
        console.error(error);
        this.mensajeError = 'Error de conexión con el servidor.';
      }
    );
  }

  private registrarIntento(usuario: string, resultado: string) {
    const nuevoAcceso = {
      fecha: new Date().toISOString(),
      usuario: usuario,
      ip: 'Web Admin', 
      navegador: navigator.userAgent,
      resultado: resultado,
      intentos: 1,
      ubicacion: 'México',
    };

    this.servicioAccesos.registrarNuevoAcceso(nuevoAcceso).subscribe({
      next: () => console.log(`Intento registrado: ${resultado}`),
      error: (err) => console.error('Error al registrar acceso', err),
    });
  }
}
