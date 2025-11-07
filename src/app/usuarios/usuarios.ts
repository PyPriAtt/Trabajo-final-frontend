import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';
import { UsuariosService, Usuario } from '../services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <div class="main-content">
        <div class="header">
          <h1>Panel de Administrador</h1>
        </div>
        <h2>👥 Gestión de Usuarios</h2>

        <div class="form-container">
          <h3>{{ usuarioEditando ? '✏️ Editar Usuario' : '➕ Agregar Nuevo Usuario' }}</h3>
          <div class="form-group">
            <input 
              type="text" 
              [(ngModel)]="nuevoUsuario.username" 
              placeholder="Nombre de usuario"
              class="form-control"
            />
          </div>
          <div class="form-group">
            <input 
              type="password" 
              [(ngModel)]="nuevoUsuario.password" 
              [placeholder]="usuarioEditando ? 'Nueva contraseña (dejar vacío para mantener)' : 'Contraseña'"
              class="form-control"
            />
          </div>
          <div class="form-group">
            <input 
              type="text" 
              [(ngModel)]="nuevoUsuario.name" 
              placeholder="Nombre completo"
              class="form-control"
            />
          </div>
          <div class="form-group">
            <select 
              [(ngModel)]="nuevoUsuario.role" 
              class="form-control"
            >
              <option value="" disabled>Seleccionar rol</option>
              <option value="admin">Administrador</option>
              <option value="student">Estudiante</option>
            </select>
          </div>
          <div class="btn-group">
            <button 
              (click)="usuarioEditando ? actualizarUsuario() : agregarUsuario()" 
              class="btn btn-success btn-add"
              [disabled]="!validarFormulario()"
            >
              {{ usuarioEditando ? '💾 Guardar Cambios' : '➕ Agregar Usuario' }}
            </button>
            <button 
              *ngIf="usuarioEditando"
              (click)="cancelarEdicion()" 
              class="btn btn-secondary btn-cancel"
            >
              ❌ Cancelar
            </button>
          </div>
        </div>

        <hr>

        <div class="table-responsive mb-4" *ngIf="usuarios.length > 0; else noData">
          <table class="table table-hover custom-table">
            <thead class="table-dark">
              <tr>
                <th>Usuario</th>
                <th>Nombre</th>
                <th>Rol</th>
                <th colspan="2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let usuario of usuarios" [class.editing]="usuarioEditando?._id === usuario._id">
                <td>{{ usuario.username }}</td>
                <td>{{ usuario.name }}</td>
                <td>
                  <span class="badge" [ngClass]="getRoleBadgeClass(usuario.role)">
                    {{ getRoleLabel(usuario.role) }}
                  </span>
                </td>
                <td>
                  <button 
                    (click)="editarUsuario(usuario)" 
                    class="btn btn-sm btn-outline-primary"
                  >
                    ✏️ Editar
                  </button>
                </td>
                <td>
                  <button 
                    (click)="eliminarUsuario(usuario._id!)" 
                    class="btn btn-sm btn-outline-danger"
                  >
                    ❌ Eliminar
                  </button>
                </td>
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
      min-height: 100vh;
      background-color: #f8f9fa;
      padding: 2rem 0;
    }

    .main-content {
      padding: 2rem;
      text-align: center;
      width: 100%;
      max-width: 800px;
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

    .form-container {
      background-color: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      border: 2px solid transparent;
      transition: border-color 0.3s;
    }

    .form-container:has(.btn-cancel) {
      border-color: #ffc107;
      background-color: #fff3cd;
    }

    .form-container h3 {
      margin-bottom: 1rem;
      color: #333;
      font-size: 1.2rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    select.form-control {
      cursor: pointer;
    }

    .btn-group {
      display: flex;
      gap: 0.5rem;
    }

    .btn-add {
      flex: 1;
      padding: 0.75rem;
      font-size: 1rem;
      font-weight: 600;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn-add:hover:not(:disabled) {
      background-color: #218838;
    }

    .btn-add:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .btn-cancel {
      flex: 1;
      padding: 0.75rem;
      font-size: 1rem;
      font-weight: 600;
      background-color: #6c757d;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn-cancel:hover {
      background-color: #5a6268;
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

    .custom-table tr.editing {
      background-color: #fff3cd !important;
      border-left: 4px solid #ffc107;
    }

    .badge {
      padding: 0.4rem 0.8rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge-admin {
      background-color: #dc3545;
      color: white;
    }

    .badge-user {
      background-color: #007bff;
      color: white;
    }

    .badge-editor {
      background-color: #28a745;
      color: white;
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
      background-color: transparent;
    }

    .btn-outline-primary:hover {
      background-color: #007bff;
      color: #fff;
    }

    .btn-outline-danger {
      color: #dc3545;
      border: 1px solid #dc3545;
      background-color: transparent;
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
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  nuevoUsuario: Usuario = { username: '', password: '', name: '', role: '' };
  usuarioEditando: Usuario | null = null;

  private router = inject(Router);
  private authService = inject(AuthService);
  private usuariosService = inject(UsuariosService);

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuariosService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => {
        console.error('Error al cargar los usuarios:', err);
      },
    });
  }

  validarFormulario(): boolean {
    if (this.usuarioEditando) {
      return !!(this.nuevoUsuario.username && this.nuevoUsuario.name && this.nuevoUsuario.role);
    }
    return !!(this.nuevoUsuario.username && this.nuevoUsuario.password && 
              this.nuevoUsuario.name && this.nuevoUsuario.role);
  }

  agregarUsuario() {
    if (this.validarFormulario()) {
      this.usuariosService.createUsuario(this.nuevoUsuario).subscribe({
        next: (usuarioCreado) => {
          this.usuarios.push(usuarioCreado);
          this.nuevoUsuario = { username: '', password: '', name: '', role: '' };
          alert('✅ Usuario agregado exitosamente');
        },
        error: (err) => {
          console.error('Error al agregar usuario:', err);
          alert('❌ Error al agregar el usuario');
        },
      });
    }
  }

  editarUsuario(usuario: Usuario) {
    this.usuarioEditando = { ...usuario };
    this.nuevoUsuario = { ...usuario, password: '' };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  actualizarUsuario() {
    if (this.usuarioEditando && this.usuarioEditando._id) {
      const datosActualizar: any = {
        username: this.nuevoUsuario.username,
        name: this.nuevoUsuario.name,
        role: this.nuevoUsuario.role
      };
      
      if (this.nuevoUsuario.password) {
        datosActualizar.password = this.nuevoUsuario.password;
      }

      this.usuariosService.updateUsuario(this.usuarioEditando._id, datosActualizar).subscribe({
        next: (usuarioActualizado) => {
          const index = this.usuarios.findIndex(u => u._id === this.usuarioEditando!._id);
          if (index !== -1) {
            this.usuarios[index] = usuarioActualizado;
          }
          this.cancelarEdicion();
          alert('✅ Usuario actualizado exitosamente');
        },
        error: (err) => {
          console.error('Error al actualizar usuario:', err);
          alert('❌ Error al actualizar el usuario');
        },
      });
    }
  }

  eliminarUsuario(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.usuariosService.deleteUsuario(id).subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter(u => u._id !== id);
          if (this.usuarioEditando?._id === id) {
            this.cancelarEdicion();
          }
          alert('✅ Usuario eliminado exitosamente');
        },
        error: (err) => {
          console.error('Error al eliminar usuario:', err);
          alert('❌ Error al eliminar el usuario');
        },
      });
    }
  }

  cancelarEdicion() {
    this.usuarioEditando = null;
    this.nuevoUsuario = { username: '', password: '', name: '', role: '' };
  }

  getRoleBadgeClass(role: string): string {
    const classes: any = {
      'admin': 'badge-admin',
      'user': 'badge-user'
    };
    return classes[role] || 'badge-user';
  }

  getRoleLabel(role: string): string {
    const labels: any = {
      'admin': 'Admin',
      'user': 'Usuario'
    };
    return labels[role] || role;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']); 
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}