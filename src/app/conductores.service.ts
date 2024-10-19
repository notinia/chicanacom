import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Conductor {
  driver_number: number;
  broadcast_name: string;
  full_name: string;
  team_name: string;
  headshot_url: string;
  country_code: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConductoresService {

  private apiUrl = 'https://api.openf1.org/v1/drivers';

  constructor(private http: HttpClient) { }

  getConductores(): Observable<Conductor[]> {
    return this.http.get<Conductor[]>(this.apiUrl);
  }
}
