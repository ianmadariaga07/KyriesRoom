import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Transaction} from '../interfaces/transaction.interface';

@Injectable({
  providedIn: 'root',
})

export class TransactionService {
  private apiUrl: string = "http://localhost:3000/api/transactions";
  constructor(private http: HttpClient) { }

  getAllTransactions(){
    return this.http.get<Transaction[]>(this.apiUrl)
  }
}
