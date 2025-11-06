import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  _id: string;
  username: string;
  role: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {  
  private apiUrl = 'https://trabajo-final-backend-1yb8.onrender.com/users'; 

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> { 
    return this.http.get<User[]>(this.apiUrl);
  }
}
