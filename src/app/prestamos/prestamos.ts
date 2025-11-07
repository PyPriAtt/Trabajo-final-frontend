import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { PrestamosService } from '../services/prestamos.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./prestamos.css'],
  template: `
<div class="admin-container">
  <div class="main-content">
    <div class="header">
      <h1>📚 Gestión de Préstamos</h1>
    </div>

    <h2>Asignar nuevo préstamo</h2>

    <div class="form-section">
      <label>Usuario:</label>
      <select [(ngModel)]="selectedUsuario">
        <option value="">Seleccione un usuario</option>
        <option *ngFor="let u of usuarios" [value]="u._id">
          {{ u.name }} ({{ u.username }})
        </option>
      </select>

      <label>Libro:</label>
      <select [(ngModel)]="selectedLibro">
        <option value="">Seleccione un libro</option>
        <option *ngFor="let l of libros" [value]="l._id">
          {{ l.titulo }} - {{ l.autor }}
        </option>
      </select>

      <label>Fecha de entrega:</label>
      <input type="date" [(ngModel)]="selectedFechaEntrega" />

      <button (click)="asignarPrestamo()" [disabled]="!selectedUsuario || !selectedLibro || !selectedFechaEntrega">
        Asignar préstamo
      </button>
    </div>

   <h3>Préstamos vigentes</h3>
<div class="table-wrapper">
  <table class="custom-table">
    <thead>
      <tr>
        <th>Usuario</th>
        <th>Libro</th>
        <th>Fecha préstamo</th>
        <th>Fecha entrega</th>
        <th>Acción</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let p of prestamos">
        <td>{{ p.usuario.name }}</td>
        <td>{{ p.libro.titulo }}</td>
        <td>{{ p.fechaPrestamo | date:'shortDate' }}</td>
        <td>{{ p.fechaEntrega | date:'shortDate' }}</td>
        <td>
          <button class="btn btn-outline-danger" (click)="eliminarPrestamo(p._id)">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
<hr>

    <div class="actions">
      <button (click)="navigateTo('admin')" class="action-btn">Volver</button>
    </div>

    <div class="footer">
      <button (click)="logout()" class="logout-btn">Cerrar Sesión</button>
    </div>
  </div>
</div>

  `,
styles: [``]

})

export class PrestamosComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private prestamosService = inject(PrestamosService);

  usuarios: any[] = [];
  libros: any[] = [];
  prestamos: any[] = [];

  selectedUsuario: string = '';
  selectedLibro: string = '';
  selectedFechaEntrega: string = '';

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.prestamosService.getUsuarios().subscribe(u => this.usuarios = u);
    this.prestamosService.getLibros().subscribe(l => this.libros = l);
    this.prestamosService.getPrestamos().subscribe(p => this.prestamos = p);
  }

  asignarPrestamo() {
    if (!this.selectedUsuario || !this.selectedLibro || !this.selectedFechaEntrega) return;

    this.prestamosService.crearPrestamo(this.selectedUsuario, this.selectedLibro, this.selectedFechaEntrega)
      .subscribe({
        next: (nuevo) => {
          this.prestamos.push(nuevo);
          this.selectedUsuario = '';
          this.selectedLibro = '';
          this.selectedFechaEntrega = '';
        }
      });
  }

  eliminarPrestamo(id: string) {
    this.prestamosService.eliminarPrestamo(id).subscribe(() => {
      this.prestamos = this.prestamos.filter(p => p._id !== id);
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

