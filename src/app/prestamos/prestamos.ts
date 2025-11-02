import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-container">
      <div class="main-content">
        <div class="header">
          <h1>Panel de Administrador</h1>
        </div>

        <div class="actions">
          <button (click)="navigateTo('usuarios')" class="action-btn" aria-label="Gestionar Usuarios">Gestionar Usuarios</button>
          <button (click)="navigateTo('libros')" class="action-btn" aria-label="Ver Libros Disponibles">Ver Libros Disponibles</button>
          <button (click)="navigateTo('prestamos')" class="action-btn" aria-label="Gestionar Préstamos">Gestionar Préstamos</button>
        </div>

        <div class="footer">
          <button (click)="logout()" class="logout-btn">Cerrar Sesión</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
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
      height: 500px;    
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      justify-content: space-between; 
    }

    .header {
      color: black;
      padding: 1rem 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .header h1 {
      margin: 0;
      font-size: 2rem;
    }

    .actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }

    .action-btn {
      padding: 1.5rem;
      font-size: 1.2rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.3s;
      width: 100%;
      text-align: center;
    }

    .action-btn:hover {
      background-color: #0056b3;
    }

    .footer {
      margin-top: auto; 
      display: flex;
      justify-content: center; 
      width: 100%;  
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
export class AdminComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
  }

  // Método de navegación ajustado para que sea más claro
  navigateTo(route: string) {
    // Usamos la ruta relativa desde "/admin"
    this.router.navigate([`/admin/${route}`]);
  }
}
