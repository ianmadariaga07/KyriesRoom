import {Transaction} from './transaction.interface';

// el signo de ? significa que la propiedad es Opcional
export interface User{
  id?: string;
  fullName: string;
  email: string;
  password?: string;
  isActive?: boolean;
  roles: string[];
  realBalance: number;
  creditCardDebt: number;
  createdAt?: string;
  updatedAt?: string;

  transactions?: Transaction[];
}
