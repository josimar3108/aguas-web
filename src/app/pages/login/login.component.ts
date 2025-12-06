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
export class LoginComponent
{
  formularioLogin: FormGroup;
  mensajeError: string = '';

  constructor(
    private enrutador: Router,
    private servicioUsuarios: ServicioUsuarios,
    private servicioAccesos: AccesosService,
    private constructorFormulario: FormBuilder
  )
  {
    //Inicializar el formulario
    this.formularioLogin = this.constructorFormulario.group({
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required],
    });
  }

  iniciarSesion()
  {
    if(this.formularioLogin.invalid)
    {
      this.mensajeError = 'Por favor completa todos los campos.';
      return;
    }

    const { usuario, contrasena } = this.formularioLogin.value;

    this.servicioUsuarios.obtenerUsuarios().subscribe(
      (listaUsuarios: any[]) =>
      {
        //Depurar datos recibidos
        console.log('Datos recibidos del servidor:', listaUsuarios);

        //Buscar usuario (Validar nombres de propiedades comunes en español e inglés)
        const usuarioEncontrado = listaUsuarios.find(
          (u) =>
          {
            const nombreUsuario = u.usuario || u.username || u.nombre;
            const correoUsuario = u.correo || u.email;
            return nombreUsuario === usuario || correoUsuario === usuario;
          }
        );

        if(usuarioEncontrado)
        {
          //Obtener rol y contraseña manejando posibles nombres de variables
          const rol = usuarioEncontrado.rol || usuarioEncontrado.role || '';
          const passReal = usuarioEncontrado.password || usuarioEncontrado.contrasena || '';

          //Validar si es administrador
          if(rol.toLowerCase() === 'administrador' || rol.toLowerCase() === 'admin')
          {
            //Validar contraseña
            if(String(passReal) === String(contrasena))
            {
              //Registrar acceso
              const nuevoAcceso = {
                fecha: new Date().toISOString(),
                usuario: usuarioEncontrado.correo || usuarioEncontrado.email,
                ip: 'Web Admin',
                navegador: navigator.userAgent,
                resultado: 'exitoso',
                intentos: 1,
                ubicacion: 'México',
              };

              this.servicioAccesos.registrarNuevoAcceso(nuevoAcceso).subscribe({
                next: () => console.log('Acceso registrado'),
                error: (err) => console.error('Error al registrar acceso', err),
              });

              localStorage.setItem(
                'usuarioSesion',
                JSON.stringify(usuarioEncontrado)
              );
              
              this.enrutador.navigate(['/home']);
            }
            else
            {
              this.mensajeError = 'Contraseña incorrecta.';
            }
          }
          else
          {
            this.mensajeError = 'Acceso denegado: Solo administradores.';
          }
        }
        else
        {
          this.mensajeError = 'Usuario no encontrado.';
        }
      },
      (error) =>
      {
        console.error(error);
        this.mensajeError = 'Error de conexión con el servidor.';
      }
    );
  }
}