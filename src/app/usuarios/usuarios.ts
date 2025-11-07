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
  styleUrls: ['./usuarios.css'],
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
  styles: [``]
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