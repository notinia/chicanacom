import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ErrorModalComponent } from '../error-modal/error-modal.component';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, ErrorModalComponent]
})
export class RegisterComponent {
  email = '';
  password = '';
  registrationError: string | null = null;
  isModalVisible: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.authService.register(this.email, this.password).subscribe({
      next: (user) => {
        console.log('Registration successful:', user);
        this.registrationError = null; // Limpiar cualquier error previo
        this.isModalVisible = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        
        // Captura el mensaje de error específico
        if (error.code === 'auth/invalid-email') {
          this.registrationError = 'El correo electrónico ingresado no es válido.';
        } else if (error.code === 'auth/email-already-in-use') {
          this.registrationError = 'El correo electrónico ya está en uso. Por favor, utiliza otro correo.';
        } else if (error.code === 'auth/weak-password') {
          this.registrationError = 'La contraseña es demasiado débil. Por favor, ingresa una contraseña más segura.';
        } else {
          this.registrationError = 'Hubo un error al registrar tu cuenta. Por favor, intenta de nuevo.';
        }

        this.isModalVisible = true; // Muestra el modal con el mensaje de error
      }
    });
  }

  closeModal() {
    this.isModalVisible = false; // Cierra el modal
  }
}
