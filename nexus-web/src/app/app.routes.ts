import { Routes } from '@angular/router';
import { TransactionList} from './components/transaction-list/transaction-list';

export const routes: Routes = [
  { path: '', redirectTo: 'transactions', pathMatch: 'full' },
  { path: 'transactions', component: TransactionList }
];
