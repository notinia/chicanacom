import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, CommonModule]
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;  // Asegúrate de que esta línea esté presente y correcta

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.errorMessage = null;  // Limpiar el mensaje de error al intentar de nuevo
    this.authService.register(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error en el registro:', error);
        this.errorMessage = this.getErrorMessage(error);
      }
    });
  }

  private getErrorMessage(error: any): string {
    if (error.code === 'auth/email-already-in-use') {
      return 'El correo electrónico ya está en uso. Por favor, usa otro correo.';
    } else if (error.code === 'auth/invalid-email') {
      return 'El correo electrónico no es válido. Por favor, verifica e intenta nuevamente.';
    } else if (error.code === 'auth/weak-password') {
      return 'La contraseña es demasiado débil. Por favor, usa una contraseña más segura.';
    } else {
      return 'Ocurrió un error al registrarse. Por favor, intenta nuevamente.';
    }
  }
}
