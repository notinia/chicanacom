import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CarrerasService, Carrera } from '../../services/carreras.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule, NgFor, NgIf],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


// SEGUIR CON LA IMPLEMENTACIÓN DE LAS SESIONES ORDENADAS (PARA DISPLAYEAR DIA FECAH CORRESPONDIANTE Y TIPOSESION)
  // VER POR QUÉ EL PROXIMACARRERA ES NULL CUANDO SE EJECUTA LA FUNCION PARA CARGAR EL ARRAY DE SESIONES DE CARRERA.

export class HomeComponent {
  carreras: Carrera[] = [];
  carrerassprint: Carrera[] = [];
  proximaCarrera: Carrera | null = null;
  sesionesProximaCarrera: Array<{
    fecha: Date;
    tipo: string;
  }> = [];

  constructor(private carreraService: CarrerasService) { }

  async ngOnInit() : Promise<any> {
    await this.cargarDatos();
    this.ordenarSesiones();
    console.log('Sesiones:', this.sesionesProximaCarrera);
  }

  private async cargarDatos() {
    // Obtener todas las carreras
    this.carreraService.getCarreras().subscribe(carreras => {
      this.carreras = carreras;
    });
    try {
      // Obtener la próxima carrera
      this.carreraService.getProximaCarrera().subscribe(carrera => {
        this.proximaCarrera = carrera;
        if (this.proximaCarrera) {
          this.carreraService.getFechaHoraLocal(this.proximaCarrera);
        }
      });
      this.carreraService.getCarrerasSprint().subscribe(carreras => {
        this.carrerassprint = carreras;
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }

  private ordenarSesiones() {
    if (!this.proximaCarrera) return;

    this.sesionesProximaCarrera.length = 0;

    // Debug the incoming data
    console.log('Próxima carrera data:', this.proximaCarrera);

    // Add First Practice
    if (this.proximaCarrera.FirstPractice?.time) {
      console.log('Adding FP1');
      this.sesionesProximaCarrera.push({
        fecha: new Date(`${this.proximaCarrera.FirstPractice.date}T${this.proximaCarrera.FirstPractice.time}`),
        tipo: 'Práctica 1'
      });
    }

    // Add Second Practice
    if (this.proximaCarrera.SecondPractice?.time) {
      console.log('Adding FP2');
      this.sesionesProximaCarrera.push({
        fecha: new Date(`${this.proximaCarrera.SecondPractice.date}T${this.proximaCarrera.SecondPractice.time}`),
        tipo: 'Práctica 2'
      });
    }

    // Add Third Practice
    if (this.proximaCarrera.ThirdPractice?.time) {
      console.log('Adding FP3');
      this.sesionesProximaCarrera.push({
        fecha: new Date(`${this.proximaCarrera.ThirdPractice.date}T${this.proximaCarrera.ThirdPractice.time}`),
        tipo: 'Práctica 3'
      });
    }

    // Add Sprint
    if (this.proximaCarrera.sprint?.time) {
      console.log('Adding Sprint');
      this.sesionesProximaCarrera.push({
        fecha: new Date(`${this.proximaCarrera.sprint.date}T${this.proximaCarrera.sprint.time}`),
        tipo: 'Sprint'
      });
    }

    // Add Qualifying
    if (this.proximaCarrera.Qualifying?.time) {
      console.log('Adding Qualifying');
      this.sesionesProximaCarrera.push({
        fecha: new Date(`${this.proximaCarrera.Qualifying.date}T${this.proximaCarrera.Qualifying.time}`),
        tipo: 'Clasificación'
      });
    }

    // Add Race
    if (this.proximaCarrera.time) {
      console.log('Adding Race');
      this.sesionesProximaCarrera.push({
        fecha: new Date(`${this.proximaCarrera.date}T${this.proximaCarrera.time}`),
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

