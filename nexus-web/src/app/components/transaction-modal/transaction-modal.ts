import { Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {DatePicker} from "primeng/datepicker";
import {Dialog} from "primeng/dialog";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Select} from "primeng/select";
import {MessageService} from 'primeng/api';
import {TransactionType} from '../../interfaces/transaction.interface';
import {TransactionService} from '../../services/transaction';
import {NgClass} from '@angular/common';
import {SubAccount} from '../../interfaces/sub-account.interface';

@Component({
  selector: 'app-transaction-modal',
  imports: [
      DatePicker,
      Dialog,
      ReactiveFormsModule,
      Select,
    NgClass
  ],
  templateUrl: './transaction-modal.html',
  styleUrl: './transaction-modal.css',
})
export class TransactionModal implements OnInit{
  @Input() subAccountList: Array<SubAccount> = [];
  @Input() isVisible: boolean = false;
  @Output() isVisibleChange = new EventEmitter<boolean>();
  @Output() transactionSaved = new EventEmitter<boolean>();


  //usaremos los toasts del padre
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);
  private transactionService = inject(TransactionService);

  ngOnInit() {
    this.setupFormLogic()
  }

  public transactionForm: FormGroup = this.fb.group({
    amount: [null, [Validators.required, Validators.min(0.01)]],
    type: ['expense', Validators.required], //valores: income, expense, payment
    subAccountId: ['', Validators.required],
    method: ['debito', Validators.required], //valores: debito, credito
    concept: ['', Validators.required],
    date: [new Date(), Validators.required],
    description: ['']
  });

  //funcion que bloquea el btn de credito
  private setupFormLogic() {
    //escuchamos cada vez que cambia el tipo de transaccion
    this.transactionForm.get('type')?.valueChanges.subscribe(selectedType => {
      //si selecciona INGRESO o PAGO A TARJETA
      if (selectedType === 'income' || selectedType === 'payment') {
        //vamos a seleccionar forzosamente debito
        this.transactionForm.get('method')?.setValue('debito');
      }
    });
  }

  //funcion para la logica de monto
  public onMontoKeyPress(event: KeyboardEvent) {
    if (event.key.length > 1 || event.ctrlKey || event.metaKey) {
      return;
    }
    const allowedChars = /[0-9.]/;
    if (!allowedChars.test(event.key)) {
      event.preventDefault();
    }
    if (event.key === '.') {
      const currentValue = (event.target as HTMLInputElement).value;
      if (currentValue.includes('.')) {
        event.preventDefault();
      }
    }
  }

  public closeTransactionForm() {
    this.isVisibleChange.emit(false);
    this.transactionForm.reset({
      type: 'expense',
      method: 'debito',
      date: new Date()
    });
  }

  public onSubmit() {
    if (this.transactionForm.invalid) {
      //finge que el usuario ya dio clic y ensucio todos los campos del formulario
      this.transactionForm.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Error de Validacion', detail: 'Campos requeridos faltantes' });
      return;
    }

    const formValues = this.transactionForm.value;
    const isCreditCard: boolean = this.transactionForm.get('method')?.value === 'credito';
    let mappedType: TransactionType;

    if (formValues.type === 'income') mappedType = TransactionType.INCOME;
    else if (formValues.type === 'expense') mappedType = TransactionType.EXPENSE;
    else mappedType = TransactionType.PAYMENT;

    //cambiamos esto y utilizamos la forma del payload por como manejamos los id y las subcuentas
    //si usamos newTransaction: Transaction nuestro back espera un objeto completo de subAccount
    //pero nosotros solo tenemos un string del id
    //con payload as any creas un objeto libre. Lo usamos cuando lo que mostramos en pantalla es diferente a
    //lo que guardamos

    const payload = {
      amount: Number(formValues.amount),
      type: mappedType,
      //pasamos directamente el id
      subAccountId: formValues.subAccountId,
      isCreditCard: isCreditCard,
      concept: formValues.concept,
      transactionDate: formValues.date,
      description: formValues.description
    };


    if(this.transactionForm.valid) {
      //usamos as any porque nuestro DTO del frontend no hace match al 100 con el del backend al momento de crear
      this.transactionService.createTransaction(payload as any).subscribe({
        next:() => {
          this.isVisibleChange.emit(false);
          this.transactionSaved.emit(true);
          //recargamps para actualizar los saldos visuales
          this.transactionForm.reset({
            type: 'expense',
            method: 'debito',
            date: new Date()
          });
          this.messageService.add({ severity: 'success', summary: 'Transaccion Completada', detail: 'Status: verified' });
        }, error: (err) => {
          //BORRAR CONSOLE.LOG PARA PRODUCCION
          console.error('Error al guardar en NestJS:', err);
          this.messageService.add({ severity: 'error', summary: 'Fallo en la transaccion', detail: 'Desc: Autorizacion denegada' });
        }
      });
    } else {
      //BORRAR CONSOLE.LOG PARA PRODUCCION
      console.warn("Formulario inválido, abortando envío.");
      this.messageService.add({ severity: 'warn', summary: 'Error de Validacion', detail: 'Campos requeridos faltantes' });
    }

    //this.transactionForm.clearValidators()
  }
}
