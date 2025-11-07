import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrestamosService {
  private apiUrl = 'https://trabajo-final-backend-1yb8.onrender.com/api'; 

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  getLibros(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/libros`);
  }

  getPrestamos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/prestamos`);
  }

  getPrestamosPorUsuario(usuarioId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/prestamos/usuario/${usuarioId}`);
  }

  crearPrestamo(usuarioId: string, libroId: string, fechaEntrega: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/prestamos`, { usuarioId, libroId, fechaEntrega });
  }

  eliminarPrestamo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/prestamos/${id}`);
  }
}
