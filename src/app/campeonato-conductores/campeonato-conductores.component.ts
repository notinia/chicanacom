import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError, combineLatest, map, Observable, Subject, switchMap, tap, throwError } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';

export interface Standing {
  position: string;
  points: string;
  wins: string;
  Driver: {
    givenName: string;
    familyName: string;
  };
  Constructors: {
    name: string;
    url: string;
  }[];
}

export interface F1Response {
  MRData: {
    StandingsTable: {
      season: string;
      StandingsLists: {
        round: string;
        DriverStandings: Standing[];
      };
    };
  };
}

@Component({
  selector: 'app-campeonato-conductores',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './campeonato-conductores.component.html',
  styleUrl: './campeonato-conductores.component.css'
})

export class CampeonatoConductoresComponent {

  private datosCargados$ = new Subject<void>();
  private API_URL = "https://ergast.com/api/f1/current/driverStandings.json";
  standings: Standing[] = [];
  conductoresPaginados: Standing[] = [];  // Lista que contiene los conductores por página
  pageSize = 10;  // Elementos por página
  currentPage = 1;  // Página actual
  totalPages = 0;  // Total de páginas sin decimales

  constructor(private http: HttpClient) {
    this.standings = [];
    this.conductoresPaginados = [];
    this.datosCargados$
    .pipe(
      // First trigger cargarDatos
      switchMap(() => this.cargarStandings())
    )
    .subscribe();
    this.datosCargados$.next(); 
    console.log(this.standings);
  }

  ngOnInit(): void { }

  // Método para obtener los datos de la API
  getStandings(): Observable<Standing[]> {
    return this.http.get<F1Response>(this.API_URL).pipe(
      map((response) => response.MRData.StandingsTable.StandingsLists[0].DriverStandings)
    );
  }

/*
  getStandings(): Observable<Standing[]> {
    return this.http.get<F1Response>(this.API_URL).pipe(
      map((response) => {
        //console.log('Full API Response:', response); // Log full response for debugging
        return response.MRData.StandingsTable.StandingsLists[0].DriverStandings;
      })
    );
  }
*/
  private cargarStandings() {
    return combineLatest({
      standings: this.getStandings()
    }).pipe(
      tap(({ standings }) => {
        this.standings = standings;
      }),
      catchError(error => {
        console.log('Error loading data:', error);
        return throwError(() => error);
      })
    );
  }

}
