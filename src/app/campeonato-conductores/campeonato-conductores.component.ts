import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { map, Observable, Subject, switchMap, tap } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';

export interface Constructor {
  url: string;
  name: string;
}

export interface Driver {
  givenName: string;
  familyName: string;
}

export interface Standing {
  position: string;
  constructor: string;
  points: string;
  wins: string;
  Driver: Driver;
  Constructors: Constructor;
}

export interface F1Response {
  MRData: {
    StandingsTable: {
      season: string;
      StandingLists: {
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

    this.getStandings().subscribe(data => {
      this.standings = data;
      //this.calcularTotalPaginas();  // Calcular el total de páginas
      //this.setPage(this.currentPage);  // Establecer la página inicial
    });
    console.log("hola");
    console.log(this.standings[0].points);

  }

  ngOnInit(): void {
  }

  // Método para obtener los datos de la API
  getStandings(): Observable<Standing[]> {
    return this.http.get<F1Response>(this.API_URL).pipe(
      map(response => response.MRData.StandingsTable.StandingLists.DriverStandings)
    );
  }

  // Calcular el total de páginas basado en la cantidad de conductores únicos
  calcularTotalPaginas() {
    this.totalPages = Math.ceil(this.standings.length / this.pageSize);  // Redondear al número entero superior
  }

  // Cambiar la página actual
  setPage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;  // Evitar avanzar a páginas fuera del rango
    }
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.conductoresPaginados = this.standings.slice(startIndex, endIndex);
    this.currentPage = page;  // Actualizar la página actual
  }

  // Método para ir a la página anterior
  previousPage() {
    if (this.currentPage > 1) {
      this.setPage(this.currentPage - 1);
    }
  }

  // Método para ir a la página siguiente
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.setPage(this.currentPage + 1);
    }
  }
}
