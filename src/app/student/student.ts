import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="student-container">
      <div class="main-content">
        <div class="header">
          <h1>Portal del Estudiante</h1>
        </div>

        <div class="content">
          <div class="card">
            <h2>Libros Pedidos:</h2>
            <ul>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          </div>
        </div>

        <div class="footer">
          <button (click)="logout()" class="logout-btn">Cerrar Sesión</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .student-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f8f9fa;
    }

    .main-content {
      padding: 2rem;
      text-align: center;
      width: 100%;
      max-width: 500px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .header {
      background-color: #28a745;
      color: white;
      padding: 1rem 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .header h1 {
      margin: 0;
      font-size: 2rem;
    }

    .content {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .card {
      background-color: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .footer {
      display: flex;
      justify-content: center;
    }

    .logout-btn {
      background-color: #dc3545;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      width: 100%;
      max-width: 200px;
    }
  `]
})
export class StudentComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
  }
}
