import { Injectable } from '@angular/core';
import { Database, getDatabase, ref, set, get, child } from '@angular/fire/database';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private db: Database;
  private DBPATHDRIVERS = 'drivers'; // Ruta relativa al nodo "drivers" en la base de datos

  constructor() {
    this.db = getDatabase(); 
  }

  // Leer datos desde una ubicación específica
  getConductores(): Observable<any[]> {
    const conductoresRef = ref(this.db, this.DBPATHDRIVERS); // Crear la referencia directamente con la ruta
    return from(get(conductoresRef)).pipe(
      map((snapshot) => (snapshot.exists() ? snapshot.val() : [])) // Convertir los datos en un arreglo
    );
  }
}
