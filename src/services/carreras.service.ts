import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";
import { Inject, Injectable } from "@angular/core";
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

    constructor(private http: HttpClient) { }

    getCarreras(): Observable<Carrera[]> {
        return this.http.get<F1Response>(this.API_URL).pipe(
            map(response => response.MRData.RaceTable.Races)
        );
    }

    // Obtener la próxima carrera
    getProximaCarrera(): Observable<Carrera> {
        return this.getCarreras().pipe(
            map(carreras => this.encontrarProximaCarrera(carreras))
        );
    }

    // Obtener carreras con sprint
    getCarrerasSprint(): Observable<Carrera[]> {
        return this.getCarreras().pipe(
            map(carreras => carreras.filter(carrera => carrera.sprint))
        );
    }

    // Obtener carreras futuras
    getCarrerasFuturas(): Observable<Carrera[]> {
        return this.getCarreras().pipe(
            map(carreras => {
                const ahora = new Date();
                return carreras.filter(carrera => {
                    const fechaCarrera = new Date(`${carrera.date}T${carrera.time || '00:00:00'}`);
                    return fechaCarrera > ahora;
                });
            })
        );
    }

    // Método privado para encontrar la próxima carrera
    private encontrarProximaCarrera(carreras: Carrera[]): Carrera {
        const ahora = new Date();

        return carreras.reduce((proxima, carrera) => {
            const fechaCarrera = new Date(`${carrera.date}T${carrera.time || '00:00:00'}`);

            if (fechaCarrera < ahora) {
                return proxima;
            }

            if (!proxima || fechaCarrera < new Date(`${proxima.date}T${proxima.time || '00:00:00'}`)) {
                return carrera;
            }

            return proxima;
        }, null as Carrera | null) || carreras[0];
    }


    // Obtener fecha y hora local de una carrera
    getFechaHoraLocal(carrera: Carrera): { fecha: Date; horario: string } {
        const fechaUTC = new Date(`${carrera.date}T${carrera.time || '00:00:00'}`);
        const fechaLocal = new Date(fechaUTC);
        const horario = fechaLocal.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return {
            fecha: fechaLocal,
            horario: horario
        };
    }
}