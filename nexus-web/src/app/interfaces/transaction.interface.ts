import {SubAccount} from './sub-account.interface';

// el signo de ? significa que la propiedad es Opcional
export interface Transaction{
  id?: string;
  amount: number;
  type: TransactionType;
  isCreditCard: boolean;
  concept: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  transactionDate: string | Date;

  subAccount?: SubAccount;
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  PAYMENT = 'PAYMENT'
}
