import { User } from './user.interface';

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
  transactionDate: string | Date;

  userId?: User;
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  PAYMENT = 'PAYMENT'
}
