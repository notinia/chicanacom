import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { Injectable } from "@angular/core";
import { map } from 'rxjs/operators';

export interface Circuit {
    circuitID: string;
    url: string;
    circuitName: string;
}

export interface Carrera {
    season: string;
    round: string;
    raceName: string;
    Circuit: Circuit;
    date: Date;
    time: string;
    FirstPractice?: {
        date: Date;
        time: string;
    };
    SecondPractice?: {
        date: Date;
        time: string;
    };
    ThirdPractice?: {
        date: Date;
        time: string;
    };
    sprint?: {
        date: Date;
        time: string;
    };
    Qualifying?: {
        date: Date;
        time: string;
    };
}

export interface F1Response {
    MRData: {
        RaceTable: {
            season: string;
            Races: Carrera[];
        };
    };
}

@Injectable({
    providedIn: 'root'
})
export class CarrerasService {
    private readonly API_URL = 'https://ergast.com/api/f1/current.json';

    constructor(private http: HttpClient) {}

    // Obtener solo las tres carreras: anterior, actual y siguiente
    getCarrerasLimitadas(): Observable<Carrera[]> {
        return this.http.get<F1Response>(this.API_URL).pipe(
            map(response => response.MRData.RaceTable.Races),
            map(carreras => this.filtrarTresCarreras(carreras))
        );
    }

    // Método privado para filtrar las tres carreras relevantes
    private filtrarTresCarreras(carreras: Carrera[]): Carrera[] {
        const ahora = new Date();

        // Encuentra la próxima carrera
        const proximaIndex = carreras.findIndex(carrera => {
            const fechaCarrera = new Date(`${carrera.date}T${carrera.time || '00:00'}`);
            return fechaCarrera > ahora;
        });

        if (proximaIndex === -1) {
            console.error('No se encontraron carreras futuras.');
            return [];
        }

        // Limitar resultados a la anterior, actual y siguiente carrera
        const anteriorIndex = Math.max(proximaIndex - 1, 0);
        const siguienteIndex = Math.min(proximaIndex + 1, carreras.length - 1);

        return [
            carreras[anteriorIndex], // Anterior
            carreras[proximaIndex], // Actual
            carreras[siguienteIndex] // Siguiente
        ];
    }

    // Obtener carreras completas
    getCarreras(): Observable<Carrera[]> {
        return this.http.get<F1Response>(this.API_URL).pipe(
            map(response => response.MRData.RaceTable.Races)
        );
    }

    // Otros métodos permanecen igual
    getProximaCarrera(): Observable<Carrera> {
        return this.getCarreras().pipe(
            map(carreras => this.encontrarProximaCarrera(carreras))
        );
    }

    private encontrarProximaCarrera(carreras: Carrera[]): Carrera {
        const ahora = new Date();
        return carreras.reduce((proxima, carrera) => {
            const fechaCarrera = new Date(`${carrera.date}T${carrera.time || '00:00'}`);
            if (fechaCarrera < ahora) {
                return proxima;
            }
            if (!proxima || fechaCarrera < new Date(`${proxima.date}T${proxima.time || '00:00'}`)) {
                return carrera;
            }
            return proxima;
        }, null as Carrera | null) || carreras[0];
    }

    getFechaHoraLocal(carrera: Carrera): { fecha: Date; horario: string } {
        const fechaUTC = new Date(`${carrera.date}T${carrera.time || '00:00'}`);
        const fechaLocal = new Date(fechaUTC);
        const horario = fechaLocal.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return {
            fecha: fechaLocal,
            horario: horario
        };
    }
}
