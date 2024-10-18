import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from "./top-bar/top-bar.component";
import { HomeComponent } from "./home/home.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { MatIconModule } from '@angular/material/icon'
import { CarrerasComponent } from "./carreras/carreras.component";
import { LayoutComponent } from "./layout/layout.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopBarComponent, HomeComponent, NavbarComponent, MatIconModule, CarrerasComponent, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'chicanacom';
}
