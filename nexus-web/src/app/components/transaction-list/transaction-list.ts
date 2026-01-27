import { Component, OnInit, signal} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Transaction} from '../../interfaces/transaction.interface';
import { TransactionService} from '../../services/transaction';
import { TableModule} from 'primeng/table';

@Component({
  selector: 'app-transaction-list',
  standalone: true, //por default ya es true
  imports: [TableModule],
  templateUrl: './transaction-list.html',
  styleUrl: './transaction-list.css',
})

export class TransactionList implements OnInit {
  public transactions = signal<Transaction[]>([]);

  constructor(private transactionService: TransactionService, private router: Router) { }

  ngOnInit() {
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
