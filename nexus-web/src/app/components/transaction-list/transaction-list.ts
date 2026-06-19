import { Component, OnInit, signal, inject} from '@angular/core';
import { Router} from '@angular/router';
import { Transaction} from '../../interfaces/transaction.interface';
import { TransactionService} from '../../services/transaction';

import {Card} from 'primeng/card';
import {Table, TableModule} from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import {PrimeNG} from 'primeng/config';

@Component({
  selector: 'app-transaction-list',
  standalone: true, //por default ya es true
  imports: [TableModule, ButtonModule],
  providers: [],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css',
})

export class TransactionList implements OnInit {
  public transactions = signal<Transaction[]>([]);

  constructor(private transactionService: TransactionService, private router: Router, private primeng: PrimeNG) { }

  ngOnInit() {
    this.primeng.ripple.set(true);
    this.transactionService.getAllTransactions().subscribe({
        next:(data: Transaction[]) => {
          this.transactions.set(data);
          console.log(this.transactions);
        }, error: (error) => {
        console.error('Error:', error);
        }
      }
    )
  }
}
