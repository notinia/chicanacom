import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

export interface Conductor {
  driver_number: number;
  full_name: string;
  team_name: string;
  country_code: string;
  headshot_url: string;
}

@Component({
  selector: 'app-conductores',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conductores.component.html',
  styleUrls: ['./conductores.component.css']
})
export class ConductoresComponent implements OnInit {
  conductores: Conductor[] = [];
  conductoresUnicos: Conductor[] = []; //buscar formas de optimizar
  conductoresPaginados: Conductor[] = []; // Lista que contiene los conductores por página
  pageSize = 10;  // Elementos por página
  currentPage = 1;  // Página actual

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getConductores().subscribe(data => {
      this.conductores = data;
      this.filtrarConductoresUnicos();  // Filtrar para obtener solo conductores únicos

      this.setPage(this.currentPage); // Establecer la página inicial
    });
  }

  // Método para obtener los datos de la API
  getConductores(): Observable<Conductor[]> {
    return this.http.get<Conductor[]>('https://api.openf1.org/v1/drivers');
  }

  filtrarConductoresUnicos() {
    const nombresUnicos = new Set<string>();
    this.conductoresUnicos = this.conductores.filter(conductor => {
      if (!nombresUnicos.has(conductor.full_name)) {
        nombresUnicos.add(conductor.full_name);
        return true;  // Incluir conductor si no ha sido añadido
      }
      return false;  // Descartar conductor duplicado
    });
  }
  // Cambiar la página actual
  setPage(page: number) {
    const startIndex = (page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.conductoresPaginados = this.conductoresUnicos.slice(startIndex, endIndex);
    this.currentPage = page;
  }

  // Método para ir a la página anterior
  previousPage() {
    if (this.currentPage > 1) {
      this.setPage(this.currentPage - 1);
    }
  }

  // Método para ir a la página siguiente
  nextPage() {
    if (this.currentPage < Math.ceil(this.conductoresUnicos.length / this.pageSize)) {
      this.setPage(this.currentPage + 1);
    }
  }
}
