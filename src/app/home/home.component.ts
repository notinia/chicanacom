import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CarrerasService, Carrera } from '../../services/carreras.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


// SEGUIR CON LA IMPLEMENTACIÓN DE LAS SESIONES ORDENADAS (PARA DISPLAYEAR DIA FECAH CORRESPONDIANTE Y TIPOSESION)

export class HomeComponent {

  carreras: Carrera[] = [];
  carrerassprint: Carrera[] = [];
  proximaCarrera: Carrera | null = null;

  sesionesOrdenadas: Array<{
    fecha: Date;
    tipo: string;
  }> = [];

  constructor(private carreraService: CarrerasService) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos() {
    // Obtener todas las carreras
    this.carreraService.getCarreras().subscribe(carreras => {
      this.carreras = carreras;
    });

    // Obtener la próxima carrera
    this.carreraService.getProximaCarrera().subscribe(carrera => {
      this.proximaCarrera = carrera;
      if (this.proximaCarrera) {
        const { fecha, horario } = this.carreraService.getFechaHoraLocal(this.proximaCarrera);
        //console.log(`Próxima carrera: ${this.proximaCarrera.raceName} - ${fecha.toLocaleDateString()} ${horario}`);
      }
    });

    this.carreraService.getCarrerasSprint().subscribe(carreras => {
      this.carrerassprint = carreras;
    });
  }

  private ordenarSesiones() {
    if (!this.proximaCarrera) return;

    const sesiones = [];

    // Agregar todas las sesiones con sus fechas y tipos
    if (this.proximaCarrera.FirstPractice) {
      sesiones.push({
        fecha: new Date(`${this.proximaCarrera.FirstPractice.date}T${this.proximaCarrera.FirstPractice.time}`),
        tipo: 'Práctica 1'
      });
    }

    if (this.proximaCarrera.SecondPractice) {
      sesiones.push({
        fecha: new Date(`${this.proximaCarrera.SecondPractice.date}T${this.proximaCarrera.SecondPractice.time}`),
        tipo: 'Práctica 2'
      });
    }

    if (this.proximaCarrera.ThirdPractice) {
      sesiones.push({
        fecha: new Date(`${this.proximaCarrera.ThirdPractice.date}T${this.proximaCarrera.ThirdPractice.time}`),
        tipo: 'Práctica 3'
      });
    }

    if (this.proximaCarrera.sprint) {
      sesiones.push({
        fecha: new Date(`${this.proximaCarrera.sprint.date}T${this.proximaCarrera.sprint.time}`),
        tipo: 'sprint'
      });
    }

    if (this.proximaCarrera.Qualifying) {
      sesiones.push({
        fecha: new Date(`${this.proximaCarrera.Qualifying.date}T${this.proximaCarrera.Qualifying.time}`),
        tipo: 'Clasificación'
      });
    }

    // Agregar la carrera
    sesiones.push({
      fecha: new Date(`${this.proximaCarrera.date}T${this.proximaCarrera.time}`),
      tipo: 'Carrera'
    });

    // Ordenar por fecha
    this.sesionesOrdenadas = sesiones.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());

    // Actualizar el tipo de sesión actual
    this.actualizarSesionActual();
  }

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

  //convertir fecha en un String de solo el Día...

}

