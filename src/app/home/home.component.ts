import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, CommonModule } from '@angular/common';
import { CarrerasService, Carrera } from '../../services/carreras.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, NgFor, NgIf, CommonModule],
  providers: [CarrerasService, DatePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  carreras: Carrera[] = []; // Tres carreras: anterior, actual, siguiente
  carreraActualIndex: number = 1; // La actual siempre está en el índice 1
  proximaCarrera: Carrera | undefined; // Carrera actualmente mostrada
  sesionesProximaCarrera: Array<{
    fecha: Date;
    tiempo: string;
    tipo: string;
    mostrarDetalles: boolean;
  }> = [];
  weekday = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  constructor(private carreraService: CarrerasService) {}

  ngOnInit(): void {
    this.carreraService.getCarrerasLimitadas().subscribe({
      next: (data: Carrera[]) => {
        this.carreras = data;
        this.actualizarCarreraActual();
        this.actualizarSesiones();
      },
      error: (err) => console.error('Error al cargar carreras:', err),
    });
  }

  actualizarCarreraActual(): void {
    this.proximaCarrera = this.carreras[this.carreraActualIndex];
  }

  actualizarSesiones(): void {
    this.sesionesProximaCarrera = [];
    if (this.proximaCarrera) {
      if (this.proximaCarrera.FirstPractice?.time) {
        this.sesionesProximaCarrera.push({
          fecha: new Date(`${this.proximaCarrera.FirstPractice.date}T${this.proximaCarrera.FirstPractice.time}`),
          tiempo: this.proximaCarrera.FirstPractice.time,
          tipo: 'Práctica 1',
          mostrarDetalles: false,
        });
      }
      if (this.proximaCarrera.SecondPractice?.time) {
        this.sesionesProximaCarrera.push({
          fecha: new Date(`${this.proximaCarrera.SecondPractice.date}T${this.proximaCarrera.SecondPractice.time}`),
          tiempo: this.proximaCarrera.SecondPractice.time,
          tipo: 'Práctica 2',
          mostrarDetalles: false,
        });
      }
      if (this.proximaCarrera.ThirdPractice?.time) {
        this.sesionesProximaCarrera.push({
          fecha: new Date(`${this.proximaCarrera.ThirdPractice.date}T${this.proximaCarrera.ThirdPractice.time}`),
          tiempo: this.proximaCarrera.ThirdPractice.time,
          tipo: 'Práctica 3',
          mostrarDetalles: false,
        });
      }
      if (this.proximaCarrera.Qualifying?.time) {
        this.sesionesProximaCarrera.push({
          fecha: new Date(`${this.proximaCarrera.Qualifying.date}T${this.proximaCarrera.Qualifying.time}`),
          tiempo: this.proximaCarrera.Qualifying.time,
          tipo: 'Clasificación',
          mostrarDetalles: false,
        });
      }
      if (this.proximaCarrera.time) {
        this.sesionesProximaCarrera.push({
          fecha: new Date(`${this.proximaCarrera.date}T${this.proximaCarrera.time}`),
          tiempo: this.proximaCarrera.time,
          tipo: 'Carrera',
          mostrarDetalles: false,
        });
      }
    }
  }

  cambiarCarrera(direccion: 'anterior' | 'siguiente'): void {
    if (direccion === 'anterior' && this.carreraActualIndex > 0) {
      this.carreraActualIndex--;
    } else if (direccion === 'siguiente' && this.carreraActualIndex < this.carreras.length - 1) {
      this.carreraActualIndex++;
    }
    this.actualizarCarreraActual();
    this.actualizarSesiones();
  }

  toggleDetalles(index: number): void {
    this.sesionesProximaCarrera[index].mostrarDetalles = !this.sesionesProximaCarrera[index].mostrarDetalles;
  }

  isLive(fecha: Date): string {
    const ahora = new Date();
    const diferenciaHoras = (fecha.getTime() - ahora.getTime()) / (1000 * 60 * 60); // Diferencia en horas
    return diferenciaHoras <= 2 && diferenciaHoras >= 0 ? 'en vivo' : fecha.toLocaleTimeString();
  }
}
