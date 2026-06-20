import { Component, OnInit, signal, computed} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router} from '@angular/router';
import { Transaction, TransactionType} from '../../interfaces/transaction.interface';
import { TransactionService} from '../../services/transaction';
import { User } from '../../interfaces/user.interface';
import { UserService} from '../../services/user';

import {TableModule} from 'primeng/table';
import {PrimeNG} from 'primeng/config';

@Component({
  selector: 'app-transaction-list',
  standalone: true, //por default ya es true
  imports: [CommonModule, TableModule],
  providers: [],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css',
})

export class TransactionList implements OnInit {
  public transactions = signal<Transaction[]>([]);
  public subAccounts = signal<User[]>([]);

  constructor(
    private transactionService: TransactionService, private router: Router, private primeng: PrimeNG, private userService: UserService,
  ){ }

  ngOnInit() {
    this.primeng.ripple.set(true);
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

    this.userService.getAllUsers().subscribe({
      next:(data: User[]) => {
        this.subAccounts.set(data);
        console.log(this.subAccounts);
      }, error: (error) => {
        console.error('Error:', error);
      }
    })
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

  protected readonly TransactionType = TransactionType;
}
