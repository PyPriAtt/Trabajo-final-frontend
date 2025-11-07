import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Libro {
  _id?: string;
  titulo: string;
  autor: string;
}

@Injectable({
  providedIn: 'root'
})
export class LibrosService {
  private apiUrl = 'https://trabajo-final-backend-1yb8.onrender.com/api/libros';

  constructor(private http: HttpClient) {}

  getLibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.apiUrl);
  }

  createLibro(libro: Libro): Observable<Libro> {
    return this.http.post<Libro>(this.apiUrl, libro);
  }

  updateLibro(id: string, libro: Libro): Observable<Libro> {
    return this.http.put<Libro>(`${this.apiUrl}/${id}`, libro);
  }

  deleteLibro(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}