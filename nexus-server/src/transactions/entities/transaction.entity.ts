import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
//debemos de importar la entidad user para usar su id
import { User } from 'src/users/entities/user.entity';

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
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;
  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;
  @Column('boolean', { default: false })
  isCreditCard: boolean;
  @Column('varchar', { nullable: false, length: 64 })
  concept: string;
  @Column('text', { nullable: true })
  description: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  transactionDate: Date;
  //RELACIONES
  //muchas Transacciones pertenecen a un Usuario
  //vamos a ocupar la dependencia circular
  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'userId' })
  user: User;
}
