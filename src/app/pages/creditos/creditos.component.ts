import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Integrante
{
  nombre: string;
  id: string;
  correo: string;
  departamento: string;
  universidad: string;
  ubicacion: string;
}

@Component({
  selector: 'app-creditos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './creditos.component.html',
  styleUrls: ['./creditos.component.scss']
})
export class CreditosComponent
{
  equipo: Integrante[] = [
    {
      nombre: 'Angel Garza Flores',
      id: 'al346718',
      correo: 'al346718@edu.uaa.mx',
      departamento: 'Department of Electronic Systems',
      universidad: 'Autonomous University of Aguascalientes',
      ubicacion: 'Aguascalientes, Mexico'
    },
    {
      nombre: 'Josimar Maldonado Rosales',
      id: 'al347589',
      correo: 'al347589@edu.uaa.mx',
      departamento: 'Department of Electronic Systems',
      universidad: 'Autonomous University of Aguascalientes',
      ubicacion: 'Aguascalientes, Mexico'
    },
    {
      nombre: 'Ian Alejandro Hernandez Aranda',
      id: 'al346169',
      correo: 'al346169@edu.uaa.mx',
      departamento: 'Department of Electronic Systems',
      universidad: 'Autonomous University of Aguascalientes',
      ubicacion: 'Aguascalientes, Mexico'
    },
    {
      nombre: 'Juan Osbaldo Escalera Valenciano',
      id: 'al347491',
      correo: 'al347491@edu.uaa.mx',
      departamento: 'Department of Electronic Systems',
      universidad: 'Autonomous University of Aguascalientes',
      ubicacion: 'Aguascalientes, Mexico'
    }
  ];
}