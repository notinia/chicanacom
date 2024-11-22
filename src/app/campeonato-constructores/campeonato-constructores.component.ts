import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError, combineLatest, map, Observable, Subject, switchMap, tap, throwError } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';


export interface Standing {
  position: string;
  points: string;
  wins: string;
  Constructor: {
    url: string;
    name: string;
    nationality: string;
  };
}

export interface F1Response {
  MRData: {
    StandingsTable: {
      season: string;
      StandingsLists: [{
        round: string;
        ConstructorStandings: Standing[];
      }];
    };
  };
}

@Component({
  selector: 'app-campeonato-constructores',
  standalone: true,
  imports: [NgFor],
  templateUrl: './campeonato-constructores.component.html',
  styleUrl: './campeonato-constructores.component.css'
})

export class CampeonatoConstructoresComponent {
  private datosCargados$ = new Subject<void>();
  private season: string;
  private API_URL = "https://ergast.com/api/f1/current/constructorStandings.json";
  standings: Standing[] = [];

  constructor(private http: HttpClient) {
    this.standings = [];
    this.season = null;
    this.datosCargados$
      .pipe(
        // First trigger cargarDatos
        switchMap(() => this.cargarStandings())
      )
      .subscribe();
    this.datosCargados$.next();
  }

  // Método para obtener los datos de la API. Posicion 0 por características de la API.
  getStandings(): Observable<Standing[]> {
    return this.http.get<F1Response>(this.API_URL).pipe(
      map(response => response.MRData.StandingsTable.StandingsLists[0].ConstructorStandings),
    );
  }

  private cargarStandings() {
    return combineLatest({
      standings: this.getStandings()
    }).pipe(
      tap(({ standings }) => {
        this.standings = standings;
        //console.log(this.standings);
      }),
      catchError(error => {
        console.log('Error loading data:', error);
        return throwError(() => error);
      })
    );
  }
}