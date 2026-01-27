
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

  userId?: string;
  //userId?: User;
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  PAYMENT = 'PAYMENT'
}
