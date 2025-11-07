import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { UsuariosComponent } from './usuarios/usuarios';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent,
    },
    {
        path: 'admin',
        loadComponent: () => import('./admin/admin').then(m => m.AdminComponent)
    },
    {
        path: 'student',
        loadComponent: () => import('./student/student').then(m => m.StudentComponent)
    },    
    {
        path: 'usuarios',
        loadComponent: () => import('./usuarios/usuarios').then(m => m.UsuariosComponent)
    },
    {
        path: 'libros',
        loadComponent: () => import('./libros/libros').then(m => m.LibrosComponent)
    },
    {
        path: 'prestamos',
        loadComponent: () => import('./prestamos/prestamos').then(m => m.PrestamosComponent)
    },
];