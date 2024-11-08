import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Userdata } from '../models/userdata';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';  


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule], // Import FormsModule aquí
  
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.email, this.password).subscribe(
      (user) => console.log('Login successful:', user),
      (error) => console.error('Login failed:', error)
    );
  }
}
