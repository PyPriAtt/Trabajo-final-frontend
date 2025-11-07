import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';
import { PrestamosService } from '../services/prestamos.service';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./student.css'],
  template: `
    <div class="student-container">
      <div class="main-content">
        <div class="header">
          <h1>📘 Portal del Estudiante</h1>
          <p *ngIf="usuario?.name">Bienvenido, <strong>{{ usuario.name }}</strong></p>
        </div>

        <div class="content">
          <div class="card">
            <h2>Libros Pedidos:</h2>
            <div *ngIf="prestamos.length === 0" class="no-books">
              <p>No tienes préstamos activos.</p>
            </div>
            <ul *ngIf="prestamos.length > 0" class="book-list">
              <li *ngFor="let p of prestamos">
                <strong>{{ p.libro.titulo }}</strong> — {{ p.libro.autor }}<br>
                <small>📅 Entrega: {{ p.fechaEntrega | date:'shortDate' }}</small>
              </li>
            </ul>
          </div>
        </div>

        <div class="footer">
          <button (click)="logout()" class="logout-btn">Cerrar Sesión</button>
        </div>
      </div>
    </div>
  `
})
export class StudentComponent implements OnInit {
  private authService = inject(AuthService);
  private prestamosService = inject(PrestamosService);
  private router = inject(Router);

  prestamos: any[] = [];
  usuario: any = null;

  ngOnInit() {
    this.usuario = this.authService.getUser();
    if (!this.usuario) {
      this.router.navigate(['/']); 
      return;
    }

    this.prestamosService.getPrestamosPorUsuario(this.usuario.id).subscribe({
      next: (prestamosData) => {
        this.prestamosService.getLibros().subscribe({
          next: (libros) => {
            this.prestamos = prestamosData.map(p => {
              const libro = libros.find(l => l.id === p.libroId);
              return { ...p, libro: libro ?? { titulo: 'Desconocido', autor: 'Desconocido' } };
            });
          },
          error: (err) => console.error('Error al cargar libros:', err)
        });
      },
      error: (err) => console.error('Error al cargar préstamos:', err)
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
