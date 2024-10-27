import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

export interface Carrera {
  raceName: string;
  Circuit: {
    circuitName: string;
    Location: {
      locality: string;
      country: string;
    };
  };
  date: string;
  time: string;
}

@Component({
  selector: 'app-carreras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carreras.component.html',
  styleUrls: ['./carreras.component.css']
})
export class CarrerasComponent implements OnInit {
  carreras: Carrera[] = [];  // Lista de carreras completas
  carrerasPaginadas: Carrera[] = [];  // Lista que contiene las carreras por página
  pageSize = 10;  // Número de elementos por página
  currentPage = 1;  // Página actual
  totalPages = 0;  // Total de páginas calculadas

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getCarreras().subscribe(data => {
      this.carreras = data.MRData.RaceTable.Races;  // Asigna las carreras a la variable
      this.calcularTotalPaginas();  // Calcular el total de páginas
      this.setPage(this.currentPage);  // Establecer la primera página a mostrar
    });
  }

  // Método para obtener los datos de la API
  getCarreras(): Observable<any> {
    return this.http.get<any>('https://ergast.com/api/f1/current.json');
  }

  // Calcular el total de páginas basado en el número de carreras
  calcularTotalPaginas() {
    this.totalPages = Math.ceil(this.carreras.length / this.pageSize);  // Redondear hacia arriba
  }

  // Establecer la página actual y obtener las carreras correspondientes
  setPage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;  // Evitar avanzar a páginas fuera del rango
    }
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.carrerasPaginadas = this.carreras.slice(startIndex, endIndex);  // Actualizar carreras paginadas
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
