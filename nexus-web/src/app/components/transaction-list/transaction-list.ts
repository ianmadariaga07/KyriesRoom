import { Component, OnInit, signal, computed, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Transaction, TransactionType} from '../../interfaces/transaction.interface';
import { TransactionService} from '../../services/transaction';
import {SubAccount} from '../../interfaces/sub-account.interface';
import {SubAccountService} from '../../services/sub-account';
import { SubAccountModal } from '../sub-account-modal/sub-account-modal';

import { TableModule } from 'primeng/table';
import { PrimeNG } from 'primeng/config';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-transaction-list',
  standalone: true, //por default ya es true
  imports: [
    CommonModule, TableModule, DialogModule, SelectModule, DatePickerModule, ReactiveFormsModule,
    ToastModule, SubAccountModal
  ],
  providers: [MessageService],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css',
})

export class TransactionList implements OnInit {
  //los signals son variables inteligentes, notifica automaticamente cuando un valor cambia. ttodo es mas rapido
  public transactions = signal<Transaction[]>([]);
  public subAccounts = signal<SubAccount[]>([]);
  public isTransactionVisible = signal<boolean>(false);
  public confirmDeleteVisible = signal<boolean>(false);
  public isSubAccountModalVisible = signal<boolean>(false);

  //quitamos el constructor y utilizamos inject que es la inyeccion de dependencias moderna
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private subAccountService = inject(SubAccountService);
  private transactionService = inject(TransactionService);
  private primeng = inject(PrimeNG);
  protected readonly TransactionType = TransactionType;

  ngOnInit() {
    this.loadTransactions();
    this.loadSubAccounts();
    this.setupFormLogic();
    this.primeng.ripple.set(true);
  }

  //Total Real sumando el realBalance de las 3 subcuentas
  public globalRealBalance = computed(() => {
    const accounts = this.subAccounts();
    let total: number = 0;

    accounts.forEach((account) => {
      //se envuelve con Number por seguridad, a veces nos dan string y asi evitamos concatenacion
      total += Number(account.realBalance);
    })
    return total;
  });

  //Total tarjeta azul, todos los creditCardDebt de las cuentas
  public globalCreditDebt = computed(() => {
    const accounts = this.subAccounts();
    let total: number = 0;

    accounts.forEach((account) => {
      total += Number(account.creditCardDebt);
    })
    return total;
  });

 //Total App sumando dos anteriores
  public globalTotalApp = computed(() => {
    return this.globalRealBalance() + this.globalCreditDebt();
  });

  public transactionForm: FormGroup = this.fb.group({
    amount: [null, [Validators.required, Validators.min(0.01)]],
    type: ['expense', Validators.required], //valores: income, expense, payment
    subAccountId: ['', Validators.required],
    method: ['debito', Validators.required], //valores: debito, credito
    concept: ['', Validators.required],
    date: [new Date(), Validators.required],
    description: ['']
  });

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
    /*
    const newTransaction: Transaction = {
      amount: Number(formValues.amount),
      type: mappedType,
      subAccount: formValues.subAccountId,
      isCreditCard: isCreditCard,
      concept: formValues.concept,
      transactionDate: formValues.date,
      description: formValues.description
    }; */

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
        next:(createdTx) => {
          this.isTransactionVisible.set(false);
          this.loadTransactions();
          this.loadSubAccounts();
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

  public deleteTransaction(id: string) {
    this.transactionService.removeTransaction(id).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Transaccion Eliminada', detail: 'Status: verified' });
        this.loadTransactions();
        this.loadSubAccounts();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Fallo en la operacion', detail: 'Desc: Autorizacion denegada' });
      }
    })
  }

  private loadTransactions() {
    this.transactionService.getAllTransactions().subscribe({
        next:(data: Transaction[]) => {
          this.transactions.set(data);
          //VAMOS A QUITAR MAS ADELANTE LOS CONSOLE.LOG, PUES ESTOS NO SON RECOMENDABLES DE UTILIZAR EN PRODUCCION
          console.log(this.transactions);
        }, error: (error) => {
          console.error('Error:', error);
        }
      }
    )
  }

  public loadSubAccounts() {
    this.subAccountService.getAllSubAccounts().subscribe({
      next:(data: SubAccount[]) => {
        this.subAccounts.set(data);
        console.log(this.subAccounts);
      }, error: (error) => {
        console.error('Error:', error);
      }
    })
  }

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

  public onMontoKeyPress(event: KeyboardEvent) {
    if (event.key.length > 1 || event.ctrlKey || event.metaKey) {
      return;
    }
    const allowedChars = /[0-9\.]/;
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
    this.isTransactionVisible.set(false)
    this.transactionForm.reset({
      type: 'expense',
      method: 'debito',
      date: new Date()
    });
  }

  //esta linea era para que el HTML pudiera ver mi interfaz
  //protected readonly TransactionService = TransactionService;
}
