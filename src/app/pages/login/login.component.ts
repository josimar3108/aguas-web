import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;

  users = [
    { user: 'Osbaldo', password: '347491' },
    { user: 'Ian', password: '346169' },
    { user: 'Josimar', password: '347589' },
    { user: 'Angel', password: '346718' },
  ];

  errorMessage: string = '';

  constructor(private router: Router) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    const username = this.loginForm.value.username.trim();
    const password = this.loginForm.value.password.trim();

    const found = this.users.find(
      (u) => u.user === username && u.password === password
    );

    if (found) {
      const loggedUser = {
        name: found.user,
        email: `${found.user.toLowerCase()}@aguas.com`,
        avatar: `https://ui-avatars.com/api/?name=${found.user}`,
      };

      localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

      this.errorMessage = '';
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'Usuario o contraseña incorrectos';
    }
  }
}