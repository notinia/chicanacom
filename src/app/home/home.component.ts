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
  carreras: Carrera[] = []; // Todas las carreras
  carreraActualIndex: number = 0; // Índice de la carrera actual (la más cercana)
  anteriorIndex: number = 0; // Índice de la carrera anterior
  siguienteIndex: number = 0; // Índice de la carrera siguiente
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
            this.carreraActualIndex = 1; // La actual siempre estará en el índice 1
            this.actualizarCarreraActual();
            this.actualizarSesiones();
        },
        error: (err) => console.error('Error al cargar carreras:', err),
    });
}

  cargarDatos(): void {
    this.carreraService.getCarreras().subscribe({
      next: (data: Carrera[]) => {
        this.carreras = data;
        this.definirCarreraActual();
        this.actualizarIndices();
        this.actualizarCarreraActual();
        this.actualizarSesiones();
      },
      error: (err) => console.error('Error al cargar carreras:', err),
    });
  }

  definirCarreraActual(): void {
    const ahora = new Date();
    this.carreraActualIndex = this.carreras.findIndex(
      (carrera) => new Date(carrera.date).getTime() > ahora.getTime()
    );
    if (this.carreraActualIndex === -1) {
      this.carreraActualIndex = this.carreras.length - 1; // Última carrera si todas ya pasaron
    }
  }

  actualizarIndices(): void {
    this.anteriorIndex = Math.max(this.carreraActualIndex - 1, 0);
    this.siguienteIndex = Math.min(this.carreraActualIndex + 1, this.carreras.length - 1);
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
    if (direccion === 'anterior') {
      this.carreraActualIndex = this.anteriorIndex;
    } else if (direccion === 'siguiente') {
      this.carreraActualIndex = this.siguienteIndex;
    }
    this.actualizarIndices();
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
