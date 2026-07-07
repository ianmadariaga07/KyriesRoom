import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {SubAccount} from '../interfaces/sub-account.interface';

@Injectable({
  providedIn: 'root',
})
export class SubAccountService {
  private apiUrl: string = "http://localhost:3000/api/sub-accounts";
  constructor(private http: HttpClient) { }

  getAllSubAccounts(){
    return this.http.get<SubAccount[]>(this.apiUrl)
  }

  createSubAccount(newSubAccount: SubAccount) {
    return this.http.post<SubAccount>(this.apiUrl, newSubAccount);
  }
}
