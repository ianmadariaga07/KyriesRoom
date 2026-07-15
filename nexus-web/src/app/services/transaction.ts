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

  createTransaction(transaction: Transaction){
    return this.http.post<Transaction>(this.apiUrl, transaction);
  }

  //pegamos el id en la url porque en las reglas de api rest cuando es delete
  //el id va pegado en la url, asi como en postman. Usamos Template Literals
  removeTransaction(id: string){
    return this.http.delete<Transaction>(`${this.apiUrl}/${id}`);
  }
}
