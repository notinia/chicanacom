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
        this.registrationError = null; 
        this.isModalVisible = false;
        this.router.navigate(['/home']); 
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.registrationError = 'Hubo un error al registrar tu cuenta. Por favor, intenta de nuevo.';
        this.isModalVisible = true;
      }
    });
  }

  closeModal() {
    this.isModalVisible = false;
  }
}
