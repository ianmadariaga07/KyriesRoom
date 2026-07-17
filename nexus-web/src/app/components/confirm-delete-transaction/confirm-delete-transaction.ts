import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { ReactiveFormsModule} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';


@Component({
  selector: 'app-confirm-delete-transaction',
  standalone: true,
  imports: [DialogModule, ReactiveFormsModule],
  templateUrl: './confirm-delete-transaction.html',
  styleUrl: './confirm-delete-transaction.css',
})

export class ConfirmDeleteTransaction {
  @Input() isVisible: boolean = false;
  //le avisamos al padre que nos cerraron
  @Output() isVisibleChange = new EventEmitter<boolean>();
  //le avisamos al padre que creamos un usuario para que recargue sus tarjetas
  @Output() onConfirm = new EventEmitter<void>();

  public closeModal() {
    this.isVisibleChange.emit(false);
  }

  public confirmar() {
    this.onConfirm.emit();
    this.closeModal();
  }

}
