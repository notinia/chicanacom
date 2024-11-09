import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CarrerasService, Carrera } from '../../services/carreras.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { catchError, combineLatest, Observable, Subject, switchMap, tap, throwError } from 'rxjs';

/*
Los observables emiten y si hay alguien suscripto se le avisa y se le pasa un valor. En este caso no va a suceder porque son observables "fríos" que emiten una sola vez (todas las llamadas a APIs restful son así), pero si tenés un observable que persiste luego de emitir una vez se puede triggerear de nuevo ese flow
*/


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, NgFor, NgIf],
  providers: [CarrerasService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

// SEGUIR CON LA IMPLEMENTACIÓN DE LAS SESIONES ORDENADAS (PARA DISPLAYEAR DIA FECAH CORRESPONDIANTE Y TIPOSESION)
// VER POR QUÉ EL PROXIMACARRERA ES NULL CUANDO SE EJECUTA LA FUNCION PARA CARGAR EL ARRAY DE SESIONES DE CARRERA.
/*
La rule of thumb es:
1) onInit porque necesitás a los inputs inicializados
2) afterViewInit porque necesitás los viewchilds inicializados
*/

export class HomeComponent {
  carreras: Carrera[];
  carrerassprint: Carrera[];
  proximaCarrera: Carrera | undefined;
  sesionesProximaCarrera: Array<{
    fecha: Date;
    tiempo: String;
    tipo: string;
  }>;
  private datosCargados$ = new Subject<void>();
  weekday = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

  constructor(
    private carreraService: CarrerasService
  ) {
    this.carreras = [];
    this.carrerassprint = [];
    this.proximaCarrera = undefined;
    this.sesionesProximaCarrera = [];
    // Llama a cargarDatos y suscríbete al evento de datos cargados para ordenar las sesiones
    /*
    this.cargarDatos();
    this.ordenarSesiones();
    */
    //se añadio un observable para triggerear la func ordenar sesiones cuando la data este cargada.
    this.datosCargados$
      .pipe(
        // First trigger cargarDatos
        switchMap(() => this.cargarDatos()),
        // Once cargarDatos completes, run ordenarSesiones
        tap(() => this.ordenarSesiones())
      )
      .subscribe();
    this.datosCargados$.next();
  }

  ngOnInit(): void {
  }

  /* V1 FUNCA PIOLA
  private cargarDatos(){
    combineLatest({
      carreras: this.carreraService.getCarreras(),
      proximaCarrera: this.carreraService.getProximaCarrera(),
      carreraSprint: this.carreraService.getCarrerasSprint()
    }).subscribe({
      next: ({ carreras, proximaCarrera, carreraSprint }) => {
        // Lo que sea que hacés con lo que devuelven las APIs
        this.carreras = carreras;
        this.proximaCarrera = proximaCarrera;
        if (this.proximaCarrera) {
          this.carreraService.getFechaHoraLocal(this.proximaCarrera);
        }
        this.carrerassprint = carreraSprint;

      },
      error: (error) => {
        // Manejo de errores
        console.log(error);
      }
    })
  }
    */

  private cargarDatos() {
    return combineLatest({
      carreras: this.carreraService.getCarreras(),
      proximaCarrera: this.carreraService.getProximaCarrera(),
      carreraSprint: this.carreraService.getCarrerasSprint()
    }).pipe(
      tap(({ carreras, proximaCarrera, carreraSprint }) => {
        this.carreras = carreras;
        this.proximaCarrera = proximaCarrera;
        if (this.proximaCarrera) {
          this.carreraService.getFechaHoraLocal(this.proximaCarrera);
        }
        this.carrerassprint = carreraSprint;
      }),
      catchError(error => {
        console.log('Error loading data:', error);
        return throwError(() => error);
      })
    );
  }

  private ordenarSesiones() {

    console.log(this.proximaCarrera);
    if (!this.proximaCarrera) return;

    this.sesionesProximaCarrera.length = 0;

    // Debug the incoming data
    console.log('Próxima carrera data:', this.proximaCarrera);

    //REEMPLAZAR POR CASE O IF ANIDADOS CUANDO SE SOLUCIONE.
    // Add First Practice
    if (this.proximaCarrera.FirstPractice?.time) {
      console.log('Adding FP1');
      this.sesionesProximaCarrera.push({
        fecha: new Date(`${this.proximaCarrera.FirstPractice.date}`),
        tiempo: new String(`${this.proximaCarrera.FirstPractice.time}`),
        tipo: 'Práctica 1'
      });
    }

    // Add Second Practice
    if (this.proximaCarrera.SecondPractice?.time) {
      console.log('Adding FP2');
      this.sesionesProximaCarrera.push({
        fecha: new Date(`${this.proximaCarrera.SecondPractice.date}T${this.proximaCarrera.SecondPractice.time}`),
        tiempo: new String(`${this.proximaCarrera.SecondPractice.time}`),
        tipo: 'Práctica 2'
      });
    }

    // Add Third Practice
    if (this.proximaCarrera.ThirdPractice?.time) {
      console.log('Adding FP3');
      this.sesionesProximaCarrera.push({
        fecha: new Date(`${this.proximaCarrera.ThirdPractice.date}T${this.proximaCarrera.ThirdPractice.time}`),
        tiempo: new String(`${this.proximaCarrera.ThirdPractice.time}`),
        tipo: 'Práctica 3'
      });
    }

    // Add Sprint
    if (this.proximaCarrera.sprint?.time) {
      console.log('Adding Sprint');
      this.sesionesProximaCarrera.push({
        fecha: new Date(`${this.proximaCarrera.sprint.date}T${this.proximaCarrera.sprint.time}`),
        tiempo: new String(`${this.proximaCarrera.sprint.time}`),
        tipo: 'Sprint'
      });
    }

    // Add Qualifying
    if (this.proximaCarrera.Qualifying?.time) {
      console.log('Adding Qualifying');
      this.sesionesProximaCarrera.push({
        fecha: new Date(`${this.proximaCarrera.Qualifying.date}T${this.proximaCarrera.Qualifying.time}`),
        tiempo: new String(`${this.proximaCarrera.Qualifying.time}`),
        tipo: 'Clasificación'
      });
    }

    // Add Race
    if (this.proximaCarrera.time) {
      console.log('Adding Race');
      this.sesionesProximaCarrera.push({
        fecha: new Date(`${this.proximaCarrera.date}T${this.proximaCarrera.time}`),
        tiempo: new String(`${this.proximaCarrera.time}`),
        tipo: 'Carrera'
      });
    }

    // Sort sessions by date
    this.sesionesProximaCarrera.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());

    // Debug the final array
    console.log('Sesiones ordenadas:', this.sesionesProximaCarrera);
  }

  /*
    private actualizarSesionActual() {
      const ahora = new Date();
      const sesionesHoy = this.sesionesOrdenadas.filter(
        sesion => sesion.fecha.toDateString() === ahora.toDateString()
      );
  
      if (sesionesHoy.length > 0) {
        // Encontrar la sesión actual o próxima de hoy
        const sesionActual = sesionesHoy.find(sesion =>
          sesion.fecha > ahora
        ) || sesionesHoy[sesionesHoy.length - 1];
  
        // Actualizar el tipo para mostrar solo la sesión actual del día
        sesionesHoy.forEach(sesion => {
          if (sesion !== sesionActual) {
            const index = this.sesionesOrdenadas.indexOf(sesion);
            if (index > -1) {
              this.sesionesOrdenadas.splice(index, 1);
            }
          }
        });
      }
    }
  */
  //convertir fecha en un String de solo el Día...

}

