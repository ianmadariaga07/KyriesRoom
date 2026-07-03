import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
//debemos de importar la entidad sub-account para usar su id
import { SubAccount } from '../../sub-accounts/entities/sub-account.entity';

//son los tipos permitidos para el tipo de transacion, si es suma o resta
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  PAYMENT = 'PAYMENT',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  //precision es para el total de digitos y scale es para los digitos decimales
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;
  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;
  @Column({ type: 'boolean', default: false })
  isCreditCard: boolean;
  @Column('varchar', { nullable: false, length: 64 })
  concept: string;
  @Column('text', { nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;
  @Index()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  transactionDate: Date;

  //nueva relacion, ahora pertenece a la Subcuenta, ya no directo al user
  @Index()
  @ManyToOne(() => SubAccount, (subAccount) => subAccount.transactions, {
    nullable: false,
  })
  @JoinColumn({ name: 'subAccountId' })
  subAccount: SubAccount;
}
