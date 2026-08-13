import { Routes } from '@angular/router';
import { TransactionList} from './components/transaction-list/transaction-list';
import { Login } from './components/login/login';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'transactions', component: TransactionList },
  { path: 'login', component: Login },
];
