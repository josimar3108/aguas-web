import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-configuracion',
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.scss',
})
export class ConfiguracionComponent {
  users = [
    { id: 1, nombre: 'Juan Pérez', rol: 'Administrador', activo: true },
    { id: 2, nombre: 'María López', rol: 'Supervisor', activo: true },
    { id: 3, nombre: 'Carlos Ruiz', rol: 'Operador', activo: false },
  ];

  selectedUser: any = null;
  showUserModal = false;
  newUser = false;

  openUserModal(user: any = null) {
    this.newUser = user === null;
    this.selectedUser = user
      ? { ...user }
      : { nombre: '', rol: 'Operador', activo: true };
    this.showUserModal = true;
  }

  saveUser() {
    if (this.newUser) {
      this.users.push({ id: Date.now(), ...this.selectedUser });
    } else {
      const index = this.users.findIndex((u) => u.id === this.selectedUser.id);
      this.users[index] = this.selectedUser;
    }
    this.showUserModal = false;
  }

  deleteUser(id: number) {
    this.users = this.users.filter((u) => u.id !== id);
  }

  forcePasswordReset(user: any) {
    alert(`Contraseña reseteada para ${user.nombre}`);
  }

  // Backups
  backups = [
    { id: 1, fecha: '2025-11-20', tamano: '22MB', tipo: 'Automático' },
    { id: 2, fecha: '2025-11-18', tamano: '20MB', tipo: 'Manual' },
  ];

  generateBackup() {
    alert('Respaldo generado correctamente.');
  }

  uploadBackup(event: any) {
    const file = event.target.files[0];
    if (file) alert('Respaldo cargado: ' + file.name);
  }

  restoreBackup(backup: any) {
    if (confirm(`¿Restaurar respaldo del ${backup.fecha}?`)) {
      alert('Sistema restaurado.');
    }
  }

  autoBackup = {
    enabled: false,
    frecuencia: 'diario',
    hora: '03:00',
  };
}
