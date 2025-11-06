import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService, User } from '../services/usuarios.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  template: `
    <div class="admin-container">
      <div class="main-content">
        <div class="header">
          <h1>Panel de Administrador</h1>
        </div>

        <h2>👥 Gestión de usuarios</h2>

        <div class="table-responsive mb-4" *ngIf="usuarios.length > 0; else noData">
          <table class="table table-hover custom-table">
            <thead class="table-dark">
              <tr>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Contraseña</th>
                <th colspan="2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let usuario of usuarios">
                <td>{{ usuario.username }}</td>
                <td>{{ usuario.role }}</td>
                <td>{{ usuario.password }}</td>
                <td><button class="btn btn-sm btn-outline-primary">✏️ Editar</button></td>
                <td><button class="btn btn-sm btn-outline-danger">❌ Eliminar</button></td>
              </tr>
            </tbody>
          </table>
        </div>

        <ng-template #noData>
          <p>No hay usuarios registrados.</p>
        </ng-template>

        <hr>

        <div class="actions">
          <button (click)="navigateTo('admin')" class="action-btn" aria-label="Inicio">Volver</button>
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
      max-width: 600px;
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
      margin-bottom: 1.5rem;
    }

    .header h1 {
      margin: 0;
      font-size: 2rem;
    }

    h2 {
      margin-bottom: 1rem;
      color: #333;
    }

    .custom-table {
      width: 100%;
      border-collapse: collapse;
      text-align: center;
    }

    .custom-table th,
    .custom-table td {
      text-align: center;
      vertical-align: middle;
      padding: 0.75rem;
      border-bottom: 1px solid #dee2e6;
    }

    .custom-table th {
      background-color: #343a40;
      color: white;
      font-weight: 600;
    }

    .custom-table tr:nth-child(even) {
      background-color: #f8f9fa;
    }

    .custom-table tr:hover {
      background-color: #e9ecef;
    }

    .btn {
      font-size: 0.9rem;
      padding: 0.3rem 0.6rem;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-outline-primary {
      color: #007bff;
      border: 1px solid #007bff;
    }

    .btn-outline-primary:hover {
      background-color: #007bff;
      color: #fff;
    }

    .btn-outline-danger {
      color: #dc3545;
      border: 1px solid #dc3545;
    }

    .btn-outline-danger:hover {
      background-color: #dc3545;
      color: #fff;
    }

    .actions {
      display: flex;
      justify-content: center;
      margin-top: 1rem;
    }

    .action-btn {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      width: 100%;
      max-width: 200px;
      transition: background-color 0.3s;
      font-size: 1rem;
    }

    .action-btn:hover {
      background-color: #0056b3;
    }

    .footer {
      margin-top: 1.5rem;
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
      transition: background-color 0.3s;
    }

    .logout-btn:hover {
      background-color: #b02a37;
    }
    p {
      color: #6c757d;
    }
  `]
})
export class UserComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);

  usuarios: User[] = [];

  ngOnInit() {
    this.usuarioService.getUsers().subscribe({
      next: (data) => this.usuarios = data,
      error: (err) => console.error('Error al obtener usuarios:', err)
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
