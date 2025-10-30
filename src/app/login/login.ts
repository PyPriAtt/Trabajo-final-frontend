import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    
    .login-form {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }
    
    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-sizing: border-box;
    }
    
    button {
      width: 100%;
      padding: 0.75rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }
    
    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
    
    .error {
      color: red;
      margin-top: 1rem;
      text-align: center;
    }
    
    .demo-users {
      margin-top: 2rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 4px;
    }
    
    .demo-users h3 {
      margin-top: 0;
      color: #666;
    }
    
    .demo-users p {
      margin: 0.5rem 0;
      font-size: 0.9rem;
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  loading = signal(false);
  error = signal('');

  constructor(private authService: AuthService) {}

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