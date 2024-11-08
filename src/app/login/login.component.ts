import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  // Importa CommonModule

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule]  // Asegúrate de incluir CommonModule aquí
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.errorMessage = null;
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error en el login:', error);
        this.errorMessage = this.getErrorMessage(error);
      }
    });
  }

  private getErrorMessage(error: any): string {
    if (error.code === 'auth/invalid-email') {
      return 'El correo electrónico no es válido. Por favor, verifica e intenta nuevamente.';
    } else if (error.code === 'auth/user-not-found') {
      return 'No existe una cuenta con este correo electrónico.';
    } else if (error.code === 'auth/wrong-password') {
      return 'La contraseña es incorrecta. Por favor, intenta nuevamente.';
    } else {
      return 'Ocurrió un error al iniciar sesión. Por favor, intenta nuevamente.';
    }
  }
}
