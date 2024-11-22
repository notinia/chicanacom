import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, CommonModule } from '@angular/common';
import { CarrerasService, Carrera } from '../../services/carreras.service';
import { NgFor, NgIf } from '@angular/common';

export interface Circuit {
  circuitID: string;
  url: string;
  circuitName: string;
}

const sessionTypes = [
  { key: 'FirstPractice', label: 'Práctica 1' },
  { key: 'SecondPractice', label: 'Práctica 2' },
  { key: 'ThirdPractice', label: 'Práctica 3' },
  { key: 'Qualifying', label: 'Clasificación' },
  { key: '', label: 'Carrera' }
];

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
    circuito: Circuit;
  }> = [];

  mostrarMasIndex: number | null = null; // Controlar qué fila está expandida

  // Como la API no ofrece duración, estimando aproximadamente 1 hora por cada sesión.
  sessionDuration = 60;

  weekday = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  constructor(private carreraService: CarrerasService) {}

  ngOnInit(): void {
    this.carreraService.getCarrerasLimitadas().subscribe({
      next: (data: Carrera[]) => {
        console.log('Carreras limitadas:', data); // Log para verificar las carreras
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
      for (const session of sessionTypes) {
        const sessionData = session.key
          ? this.proximaCarrera[session.key]
          : this.proximaCarrera;
        if (sessionData?.time) {
          // Se añade un día por error de la API.
          const originalDate = new Date(`${sessionData.date}T${sessionData.time}`);
          originalDate.setDate(originalDate.getDate() + 1);
          this.sesionesProximaCarrera.push({
            fecha: originalDate,
            tiempo: session.key
              ? this.getHoraLocalFromUTC(sessionData.time)
              : sessionData.time,
            tipo: session.label,
            mostrarDetalles: false,
            circuito: this.proximaCarrera.Circuit,
          });
        }
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
    this.mostrarMasIndex = this.mostrarMasIndex === index ? null : index; // Abrir o cerrar detalles
  }

  getHoraLocalFromUTC(utcTime: string): string {
    const fechaUTC = new Date(`1970-01-01T${utcTime}`);
    const utcOffset = -3;
    const fechaLocal = new Date(fechaUTC.getTime() + utcOffset * 60 * 60 * 1000);
    return fechaLocal.toISOString().substring(11, 16);
  }

  isLive(fecha: Date): string {
    const ahora = new Date(); // Hora actual
    const diferenciaMinutos = (fecha.getTime() - ahora.getTime()) / (1000 * 60); // Diferencia en minutos
    if (diferenciaMinutos >= -59 && diferenciaMinutos <= 0) {
      return 'En vivo!'; // Dentro del rango de 1 hora antes o durante
    } else if (diferenciaMinutos < -60) {
      return 'Finalizada'; // Más de 1 hora después
    } else {
      return fecha.toLocaleDateString('es-ES', { weekday: 'long' }).toUpperCase() + " " + fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // Antes de la fecha
    }
  }
}
