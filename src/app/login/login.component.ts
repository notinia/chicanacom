import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    // Verificar formato de correo electrónico
    if (!this.validateEmail(this.email)) {
      console.error('Formato de correo electrónico inválido');
      alert('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        console.log('Inicio de sesión exitoso');
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error en el login:', error);
        alert('Error en el login: ' + error.message); // Muestra el mensaje de error al usuario
      }
    });
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
