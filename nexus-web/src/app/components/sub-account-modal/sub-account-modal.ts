import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';

import { SubAccountService } from '../../services/sub-account';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-sub-account-modal',
  standalone: true,
  imports: [CommonModule, DialogModule, ReactiveFormsModule],
  templateUrl: './sub-account-modal.html',
  styleUrl: './sub-account-modal.css',
})


export class SubAccountModal {
  @Input() isVisible: boolean = false;
  //le avisamos al padre que nos cerraron
  @Output() isVisibleChange = new EventEmitter<boolean>();
  //le avisamos al padre que creamos un usuario para que recargue sus tarjetas
  @Output() onUserCreated = new EventEmitter<void>();

  //el constructor y los inject hacen exactamente lo mismo, pero inject es mas reciente
  private fb = inject(FormBuilder);
  private subAccountService = inject(SubAccountService);
  private userService = inject(UserService);
  //usaremos los toasts del padre
  private messageService = inject(MessageService);
 //la ocupamos temporalmente porque todavia no tenemos un login
  private currentUserId: string = '';

  public subAccountForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    realBalance: [0, [Validators.required, Validators.min(0)]],
    creditCardDebt: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        // Si hay usuarios en la base de datos, tomamos el ID del primero
        if (users && users.length > 0) {
          this.currentUserId = users[0].id!;
        }
      },
      error: (err) => console.error('Error cargando el usuario para el hack', err)
    });
  }

  public closeModal() {
    this.isVisibleChange.emit(false);
    //limpiamos el formulario
    this.subAccountForm.reset({ realBalance: 0, creditCardDebt: 0 });
  }

  public onSubmit() {
    if (this.subAccountForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Datos Incompletos', detail: 'Verifique los campos del usuario.' });
      return;
    }

    if (!this.currentUserId) {
      this.messageService.add({ severity: 'error', summary: 'Error Crítico', detail: 'No hay usuario base en la BD para vincular la subcuenta.' });
      return;
    }

    //tomamos las cosas del formulario y le
    //metemos el ID del duenio pero de manera oculta, con
    //la solucion temporal. Mapeamos las cosas
    const formValues = this.subAccountForm.value;
    //payload es carga util, osea lo del formulario. el JSON que se va a mandar por el HTTP POST. Es el estandar de la industria
    //los tres puntos (son los spread operator) es para evitar la anidacion
    //en este caso es para que meta lo del formulario y el id ttodo junto y no separado
    const payload = {
      ...formValues,
      //esto es lo que el DTO de NestJS exige
      userId: this.currentUserId
    };

    //payload as any porque subAccount espera un objeto completo de user pero payload tiene solo el string
    //con as any nos saltamos eso
    //deberiamos hacer una interfaz de CreateSubAccountDTO para evitar el any
    this.subAccountService.createSubAccount(payload as any).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Subcuenta Creada', detail: 'La subcuenta ha sido registrada exitosamente.' });
        //recargamos la info para el padre
        this.onUserCreated.emit();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error al crear subcuenta:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar la subcuenta.' });
      }
    });
  }
}
