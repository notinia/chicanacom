import { Injectable } from '@angular/core';
import { Auth, user, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) {}

  isAuthenticated(): Observable<boolean> {
    return user(this.auth).pipe(
      map((user: User | null) => !!user)  // Devuelve true si el usuario existe
    );
  }

  // Método para registro de usuario
  register(email: string, password: string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  // Método para iniciar sesión
  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  // Método para cerrar sesión
  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  // Método para obtener el usuario actual
  get currentUser() {
    return this.auth.currentUser;
  }
}
