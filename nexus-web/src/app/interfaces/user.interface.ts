import {SubAccount} from './sub-account.interface';

// el signo de ? significa que la propiedad es Opcional
export interface User{
  id?: string;
  name:string;
  lastName:string;
  nickname:string;
  email: string;
  password?: string;
  isActive?: boolean;
  roles: string[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;

  subAccounts?: SubAccount[];
}
