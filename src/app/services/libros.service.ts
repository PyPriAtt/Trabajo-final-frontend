import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Libro {
  _id?: string;
  titulo: string;
  autor: string;
  genero: string;
  anoPublicacion: number;
}

@Injectable({
  providedIn: 'root',
})
export class LibrosService {
  private apiUrl = 'https://trabajo-final-backend-1yb8.onrender.com/libros'; 

  constructor(private http: HttpClient) {}

  getLibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(this.apiUrl);
  }
}
