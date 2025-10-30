import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-container">
      <div class="header">
        <h1>Panel de Administrador</h1>
        <div class="user-info">
          <span>Bienvenido, {{ authService.currentUser()?.name }}</span>
          <button (click)="logout()" class="logout-btn">Cerrar Sesión</button>
        </div>
      </div>
      
      <div class="content">
        <div class="card">
          <h2>Funciones de Administrador</h2>
          <ul>
            <li>Gestionar usuarios</li>
            <li>Ver reportes</li>
            <li>Configurar sistema</li>
            <li>Administrar contenido</li>
          </ul>
        </div>
        
        <div class="card">
          <h2>Estadísticas</h2>
          <div class="stats">
            <div class="stat-item">
              <h3>Usuarios Activos</h3>
              <p>25</p>
            </div>
            <div class="stat-item">
              <h3>Estudiantes</h3>
              <p>20</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      min-height: 100vh;
      background-color: #f8f9fa;
    }
    
    .header {
      background-color: #343a40;
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .logout-btn {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .content {
      padding: 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .stats {
      display: flex;
      gap: 2rem;
    }
    
    .stat-item {
      text-align: center;
    }
    
    .stat-item h3 {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }
    
    .stat-item p {
      margin: 0.5rem 0 0 0;
      font-size: 2rem;
      font-weight: bold;
      color: #007bff;
    }
  `]
})
export class AdminComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}