import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';
import { LibrosService, Libro } from '../services/libros.service';

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <div class="main-content">
        <div class="header">
          <h1>Panel de Administrador</h1>
        </div>
        <h2>📚 Gestión de libros</h2>

        <!-- FORMULARIO PARA AGREGAR/EDITAR LIBRO -->
        <div class="form-container">
          <h3>{{ libroEditando ? '✏️ Editar Libro' : '➕ Agregar Nuevo Libro' }}</h3>
          <div class="form-group">
            <input 
              type="text" 
              [(ngModel)]="nuevoLibro.titulo" 
              placeholder="Título del libro"
              class="form-control"
            />
          </div>
          <div class="form-group">
            <input 
              type="text" 
              [(ngModel)]="nuevoLibro.autor" 
              placeholder="Autor del libro"
              class="form-control"
            />
          </div>
          <div class="btn-group">
            <button 
              (click)="libroEditando ? actualizarLibro() : agregarLibro()" 
              class="btn btn-success btn-add"
              [disabled]="!nuevoLibro.titulo || !nuevoLibro.autor"
            >
              {{ libroEditando ? '💾 Guardar Cambios' : '➕ Agregar Libro' }}
            </button>
            <button 
              *ngIf="libroEditando"
              (click)="cancelarEdicion()" 
              class="btn btn-secondary btn-cancel"
            >
              ❌ Cancelar
            </button>
          </div>
        </div>

        <hr>

        <div class="table-responsive mb-4" *ngIf="libros.length > 0; else noData">
          <table class="table table-hover custom-table">
            <thead class="table-dark">
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th colspan="2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let libro of libros" [class.editing]="libroEditando?._id === libro._id">
                <td>{{ libro.titulo }}</td>
                <td>{{ libro.autor }}</td>
                <td>
                  <button 
                    (click)="editarLibro(libro)" 
                    class="btn btn-sm btn-outline-primary"
                  >
                    ✏️ Editar
                  </button>
                </td>
                <td>
                  <button 
                    (click)="eliminarLibro(libro._id!)" 
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
          <p>No hay libros registrados.</p>
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
      max-width: 700px;
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
export class LibrosComponent implements OnInit {
  libros: Libro[] = [];
  nuevoLibro: Libro = { titulo: '', autor: '' };
  libroEditando: Libro | null = null;

  private router = inject(Router);
  private authService = inject(AuthService);
  private librosService = inject(LibrosService);

  ngOnInit() {
    this.cargarLibros();
  }

  cargarLibros() {
    this.librosService.getLibros().subscribe({
      next: (data) => {
        this.libros = data;
      },
      error: (err) => {
        console.error('Error al cargar los libros:', err);
      },
    });
  }

  agregarLibro() {
    if (this.nuevoLibro.titulo && this.nuevoLibro.autor) {
      this.librosService.createLibro(this.nuevoLibro).subscribe({
        next: (libroCreado) => {
          this.libros.push(libroCreado);
          this.nuevoLibro = { titulo: '', autor: '' };
          alert('✅ Libro agregado exitosamente');
        },
        error: (err) => {
          console.error('Error al agregar libro:', err);
          alert('❌ Error al agregar el libro');
        },
      });
    }
  }

  editarLibro(libro: Libro) {
    this.libroEditando = { ...libro };
    this.nuevoLibro = { ...libro };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  actualizarLibro() {
    if (this.libroEditando && this.libroEditando._id) {
      this.librosService.updateLibro(this.libroEditando._id, this.nuevoLibro).subscribe({
        next: (libroActualizado) => {
          const index = this.libros.findIndex(l => l._id === this.libroEditando!._id);
          if (index !== -1) {
            this.libros[index] = libroActualizado;
          }
          this.cancelarEdicion();
          alert('✅ Libro actualizado exitosamente');
        },
        error: (err) => {
          console.error('Error al actualizar libro:', err);
          alert('❌ Error al actualizar el libro');
        },
      });
    }
  }

  eliminarLibro(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este libro?')) {
      this.librosService.deleteLibro(id).subscribe({
        next: () => {
          this.libros = this.libros.filter(l => l._id !== id);
          if (this.libroEditando?._id === id) {
            this.cancelarEdicion();
          }
          alert('✅ Libro eliminado exitosamente');
        },
        error: (err) => {
          console.error('Error al eliminar libro:', err);
          alert('❌ Error al eliminar el libro');
        },
      });
    }
  }

  cancelarEdicion() {
    this.libroEditando = null;
    this.nuevoLibro = { titulo: '', autor: '' };
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']); 
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}