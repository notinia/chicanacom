import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Carrera {
  id: number;
  nombre: string;
  fecha: string;
  piloto: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarrerasService {

  private apiUrl = 'https://api.openf1.org/v1';  // Reemplazar con la URL real

  constructor(private http: HttpClient) { }

  getCarreras(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(this.apiUrl);
  }
}
