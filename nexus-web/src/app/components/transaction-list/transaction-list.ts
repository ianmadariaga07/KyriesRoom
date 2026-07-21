import { Component, OnInit, signal, computed, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { Transaction, TransactionType} from '../../interfaces/transaction.interface';
import { TransactionService} from '../../services/transaction';
import {SubAccount} from '../../interfaces/sub-account.interface';
import {SubAccountService} from '../../services/sub-account';
import { SubAccountModal } from '../sub-account-modal/sub-account-modal';
import {ConfirmDeleteTransaction} from '../confirm-delete-transaction/confirm-delete-transaction';

import { TableModule } from 'primeng/table';
import { PrimeNG } from 'primeng/config';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {TransactionModal} from '../transaction-modal/transaction-modal';

@Component({
  selector: 'app-transaction-list',
  standalone: true, //por default ya es true
  imports: [
    CommonModule, TableModule, DialogModule, SelectModule, DatePickerModule, ReactiveFormsModule,
    ToastModule, SubAccountModal, ConfirmDeleteTransaction, TransactionModal
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
  public isTransactionDelete = signal<boolean>(false);
  public isSubAccountModalVisible = signal<boolean>(false);
  public idDelete: string = '';

  //quitamos el constructor y utilizamos inject que es la inyeccion de dependencias moderna
  private messageService = inject(MessageService);
  private subAccountService = inject(SubAccountService);
  private transactionService = inject(TransactionService);
  private primeng = inject(PrimeNG);
  protected readonly TransactionType = TransactionType;

  ngOnInit() {
    this.loadTransactions();
    this.loadSubAccounts();
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

  public deleteTransaction(id: string) {
    this.idDelete = id;
    this.isTransactionDelete.set(true);
  }

  public executeDelete() {
    this.transactionService.removeTransaction(this.idDelete).subscribe({
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

  public loadTransactions() {
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

  //esta linea era para que el HTML pudiera ver mi interfaz
  //protected readonly TransactionService = TransactionService;
}
