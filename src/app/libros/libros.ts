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
  styleUrls: ['./libros.css'],
  template: `
    <div class="admin-container">
      <div class="main-content">
        <div class="header">
          <h1>Panel de Administrador</h1>
        </div>
        <h2>📚 Gestión de libros</h2>

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
  styles: [``]
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