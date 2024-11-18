import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, CommonModule } from '@angular/common';
import { CarrerasService, Carrera } from '../../services/carreras.service';
import { NgFor, NgIf } from '@angular/common';
import { catchError, combineLatest, Subject, switchMap, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, NgFor, NgIf, CommonModule],
  providers: [CarrerasService, DatePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  carreras: Carrera[];
  carrerassprint: Carrera[];
  proximaCarrera: Carrera | undefined;
  sesionesProximaCarrera: Array<{
      fecha: Date;
      tiempo: string;
      tipo: string;
      mostrarDetalles: boolean;
    }> = [];
  private datosCargados$ = new Subject<void>();
  isLive(fecha: Date): string {
    const ahora = new Date();
    const diferenciaHoras = (fecha.getTime() - ahora.getTime()) / (1000 * 60 * 60); // Diferencia en horas
    return diferenciaHoras <= 2 && diferenciaHoras >= 0 ? 'en vivo' : fecha.toLocaleTimeString(); // Mostrar hora o "en vivo"
  }
  weekday = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  constructor(private carreraService: CarrerasService) {
    this.carreras = [];
    this.carrerassprint = [];
    this.proximaCarrera = undefined;
    this.sesionesProximaCarrera = [];

    this.datosCargados$
      .pipe(
        switchMap(() => this.cargarDatos()),
        tap(() => this.ordenarSesiones())
      )
      .subscribe();
    this.datosCargados$.next();
  }

  ngOnInit(): void {}

  private cargarDatos() {
    console.log('Método cargarDatos llamado'); // Para verificar que se llama
    return combineLatest({
        carreras: this.carreraService.getCarreras(),
        proximaCarrera: this.carreraService.getProximaCarrera(),
        carreraSprint: this.carreraService.getCarrerasSprint()
    }).pipe(
        tap(({ carreras, proximaCarrera, carreraSprint }) => {
            console.log('Datos recibidos de la API:', { carreras, proximaCarrera, carreraSprint }); // Ver datos
            this.carreras = carreras;
            this.proximaCarrera = proximaCarrera;
            if (this.proximaCarrera) {
                this.carreraService.getFechaHoraLocal(this.proximaCarrera);
            }
            this.carrerassprint = carreraSprint;
        }),
        catchError(error => {
            console.error('Error cargando datos:', error); // Manejo de errores
            return throwError(() => error);
        })
    );
}

  private ordenarSesiones() {
    if (!this.proximaCarrera) return;

    this.sesionesProximaCarrera = [];

    if (this.proximaCarrera.FirstPractice?.time) {
      this.sesionesProximaCarrera.push({
        fecha: new Date(`${this.proximaCarrera.FirstPractice.date}T${this.proximaCarrera.FirstPractice.time}`),
        tiempo: this.proximaCarrera.FirstPractice.time,
        tipo: 'Práctica 1',
        mostrarDetalles: false
      });
    }

    if (this.proximaCarrera.SecondPractice?.time) {
      this.sesionesProximaCarrera.push({
        fecha: new Date(`${this.proximaCarrera.SecondPractice.date}T${this.proximaCarrera.SecondPractice.time}`),
        tiempo: this.proximaCarrera.SecondPractice.time,
        tipo: 'Práctica 2',
        mostrarDetalles: false
      });
    }

    if (this.proximaCarrera.ThirdPractice?.time) {
      this.sesionesProximaCarrera.push({
        fecha: new Date(`${this.proximaCarrera.ThirdPractice.date}T${this.proximaCarrera.ThirdPractice.time}`),
        tiempo: this.proximaCarrera.ThirdPractice.time,
        tipo: 'Práctica 3',
        mostrarDetalles: false
      });
    }

    if (this.proximaCarrera.Qualifying?.time) {
      this.sesionesProximaCarrera.push({
        fecha: new Date(`${this.proximaCarrera.Qualifying.date}T${this.proximaCarrera.Qualifying.time}`),
        tiempo: this.proximaCarrera.Qualifying.time,
        tipo: 'Clasificación',
        mostrarDetalles: false
      });
    }

    if (this.proximaCarrera.time) {
      this.sesionesProximaCarrera.push({
        fecha: new Date(`${this.proximaCarrera.date}T${this.proximaCarrera.time}`),
        tiempo: this.proximaCarrera.time,
        tipo: 'Carrera',
        mostrarDetalles: false
      });
    }

    this.sesionesProximaCarrera.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
  }

  toggleDetalles(index: number): void {
    this.sesionesProximaCarrera[index].mostrarDetalles = !this.sesionesProximaCarrera[index].mostrarDetalles;
  }
} 
