import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';

import { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, ReactiveFormsModule],
  templateUrl: './user-form-modal.html'
})

export class UserFormModalComponent {
  @Input() isVisible: boolean = false;
  //OUTPUT (Two-way binding): Le avisamos al padre que nos cerraron
  @Output() isVisibleChange = new EventEmitter<boolean>();
  //OUTPUT: Le avisamos al padre que creamos un usuario para que recargue sus tarjetas
  @Output() onUserCreated = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private messageService = inject(MessageService); //usaremos los toasts del padre

  public userForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    realBalance: [0, [Validators.required, Validators.min(0)]],
    creditCardDebt: [0, [Validators.required, Validators.min(0)]]
  });

  public closeModal() {
    this.isVisibleChange.emit(false);
    this.userForm.reset({ realBalance: 0, creditCardDebt: 0 }); //limpiamos el formulario
  }

  public onSubmit() {
    if (this.userForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Datos Incompletos', detail: 'Verifique los campos del usuario.' });
      return;
    }

    const newUser: User = this.userForm.value;

    this.userService.createUser(newUser).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Usuario Creado', detail: 'La subcuenta ha sido registrada exitosamente.' });
        this.onUserCreated.emit(); //recargamos la info para el padre
        this.closeModal();
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar la subcuenta.' });
      }
    });
  }
}
