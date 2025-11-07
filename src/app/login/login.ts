import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./login.css'],
  template: `
    <div class="login-container">
      <div class="login-form">
        <h2>Iniciar Sesión</h2>
        
        <form (ngSubmit)="onLogin()">
          <div class="form-group">
            <label>Usuario:</label>
            <input 
              type="text" 
              [(ngModel)]="username" 
              name="username"
              required>
          </div>
          
          <div class="form-group">
            <label>Contraseña:</label>
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password"
              required>
          </div>
          
          <button type="submit" [disabled]="loading()">
            {{ loading() ? 'Cargando...' : 'Ingresar' }}
          </button>
        </form>
        
        @if (error()) {
          <div class="error">{{ error() }}</div>
        }
        
        <div class="demo-users">
          <h3>Usuarios de Prueba:</h3>
          <p><strong>Admin:</strong> admin / admin123</p>
          <p><strong>Estudiante:</strong> student / student123</p>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);  
  username = '';
  password = '';
  loading = signal(false);
  error = signal('');

  constructor() {}

  onLogin() {
    if (!this.username || !this.password) {
      this.error.set('Por favor complete todos los campos');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success && response.user) {
          this.authService.setUser(response.user);
          if (response.user.role === 'admin') {
            this.router.navigate(['/admin']);
          } else if (response.user.role === 'student') {
            this.router.navigate(['/student']);
          }
        } else {
          this.error.set(response.message || 'Error de autenticación');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Error de conexión con el servidor');
      }
    });
  }
}