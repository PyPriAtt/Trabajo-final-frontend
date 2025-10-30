import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="student-container">
      <div class="header">
        <h1>Portal del Estudiante</h1>
        <div class="user-info">
          <span>Bienvenido, {{ authService.currentUser()?.name }}</span>
          <button (click)="logout()" class="logout-btn">Cerrar Sesión</button>
        </div>
      </div>
      
      <div class="content">
        <div class="card">
          <h2>Mis Cursos</h2>
          <div class="course-list">
            <div class="course-item">
              <h3>Matemáticas</h3>
              <p>Progreso: 75%</p>
            </div>
            <div class="course-item">
              <h3>Historia</h3>
              <p>Progreso: 60%</p>
            </div>
            <div class="course-item">
              <h3>Ciencias</h3>
              <p>Progreso: 90%</p>
            </div>
          </div>
        </div>
        
        <div class="card">
          <h2>Tareas Pendientes</h2>
          <ul>
            <li>Ensayo de Historia - Vence: 15/12/2024</li>
            <li>Ejercicios de Matemáticas - Vence: 18/12/2024</li>
            <li>Proyecto de Ciencias - Vence: 20/12/2024</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .student-container {
      min-height: 100vh;
      background-color: #f8f9fa;
    }
    
    .header {
      background-color: #28a745;
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
    
    .course-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .course-item {
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 4px;
      border-left: 4px solid #28a745;
    }
    
    .course-item h3 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }
    
    .course-item p {
      margin: 0;
      color: #666;
    }
  `]
})
export class StudentComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}