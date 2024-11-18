// sesion-detalle.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sesion-detalle',
  templateUrl: './sesion-detalle.component.html',
  styleUrls: ['./sesion-detalle.component.css']
})
export class SesionDetalleComponent implements OnInit {
  tipoSesion: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.tipoSesion = this.route.snapshot.paramMap.get('tipo');
  }
}
