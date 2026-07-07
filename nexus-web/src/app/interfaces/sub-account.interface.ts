import {User} from './user.interface';
import {Transaction} from './transaction.interface';

export interface SubAccount {
  id?: string;
  name: string;
  realBalance: number;
  creditCardDebt: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;

  //una subcuenta pertenece a un solo usuario pero puede tener muchas transacciones
  user?: User;
  transactions: Transaction[];
}
