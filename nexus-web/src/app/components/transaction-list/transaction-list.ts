import { Component, OnInit, signal, computed, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Transaction, TransactionType} from '../../interfaces/transaction.interface';
import { TransactionService} from '../../services/transaction';
import { User } from '../../interfaces/user.interface';
import { UserService} from '../../services/user';

import { TableModule } from 'primeng/table';
import { PrimeNG } from 'primeng/config';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-transaction-list',
  standalone: true, //por default ya es true
  imports: [
    CommonModule, TableModule, DialogModule, SelectModule, DatePickerModule, ReactiveFormsModule
  ],
  providers: [],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css',
})

export class TransactionList implements OnInit {
  public transactions = signal<Transaction[]>([]);
  public subAccounts = signal<User[]>([]);
  public isTransactionVisible = signal<boolean>(false);

  private fb = inject(FormBuilder);
  protected readonly TransactionType = TransactionType;

  constructor(
    private transactionService: TransactionService, private primeng: PrimeNG,
    private userService: UserService
  ){ }

  ngOnInit() {
    this.loadTransactions();
    this.loadUsers();
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
    userId: ['', Validators.required],
    method: ['debito', Validators.required], //valores: debito, credito
    concept: ['', Validators.required],
    date: [new Date(), Validators.required],
    description: ['']
  });

  public onSubmit() {
    const formValues = this.transactionForm.value;
    const isCreditCard: boolean = this.transactionForm.get('method')?.value === 'credito';
    let mappedType: TransactionType;

    if (formValues.type === 'income') mappedType = TransactionType.INCOME;
    else if (formValues.type === 'expense') mappedType = TransactionType.EXPENSE;
    else mappedType = TransactionType.PAYMENT;

    const newTransaction: Transaction = {
      amount: Number(formValues.amount),
      type: mappedType,
      userId: formValues.userId,
      isCreditCard: isCreditCard,
      concept: formValues.concept,
      transactionDate: formValues.date,
      description: formValues.description
    };

    if(this.transactionForm.valid) {
      this.transactionService.createTransaction(newTransaction).subscribe({
        next:(createdTx) => {
          this.isTransactionVisible.set(false);
          this.loadTransactions();
          this.transactionForm.reset({
              type: 'expense',
              method: 'debito',
              date: new Date()
          });
        }, error: (err) => {
          //BORRAR CONSOLE.LOG PARA PRODUCCION
          console.error('Error al guardar en NestJS:', err);
        }
      });
    } else {
      //BORRAR CONSOLE.LOG PARA PRODUCCION
      console.warn("Formulario inválido, abortando envío.");
    }
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

  private loadUsers() {
    this.userService.getAllUsers().subscribe({
      next:(data: User[]) => {
        this.subAccounts.set(data);
        console.log(this.subAccounts);
      }, error: (error) => {
        console.error('Error:', error);
      }
    })
  }
}
