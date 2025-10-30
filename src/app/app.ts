import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth';
import { LoginComponent } from './login/login';
import { AdminComponent } from './admin/admin';
import { StudentComponent } from './student/student';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    HttpClientModule, 
    LoginComponent, 
    AdminComponent, 
    StudentComponent
  ],
  template: `
    @if (!authService.isLoggedIn()) {
      <app-login></app-login>
    } @else {
      @if (authService.currentUser()?.role === 'admin') {
        <app-admin></app-admin>
      } @else if (authService.currentUser()?.role === 'student') {
        <app-student></app-student>
      }
    }
  `
})
export class AppComponent implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authService.checkStoredUser();
  }
}