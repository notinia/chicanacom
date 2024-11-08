import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  template: `
    <div class="modal" tabindex="-1" [ngClass]="{'show': isVisible}" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Error</h5>
            <button type="button" class="btn-close" aria-label="Close" (click)="closeModal()"></button>
          </div>
          <div class="modal-body">
            <p>{{ errorMessage }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="closeModal()">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [CommonModule],
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent {
  @Input() errorMessage: string = '';  // Recibe el mensaje de error
  @Input() isVisible: boolean = false; // Controla la visibilidad del modal
  @Output() close = new EventEmitter<void>(); // Evento para cerrar el modal

  closeModal() {
    this.close.emit();  // Emite el evento de cierre
  }
}
