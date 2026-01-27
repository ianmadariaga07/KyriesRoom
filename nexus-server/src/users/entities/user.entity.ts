import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Transaction } from 'src/transactions/entities/transaction.entity';

@Entity('users')
export class User {
  //ID unico
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text')
  fullName: string;
  @Column('text', { unique: true })
  email: string;
  //select:false es para que no traiga la password cuando pida el user
  @Column('text', { select: false })
  password: string;
  @Column('bool', { default: true })
  isActive: boolean;
  //admin o usuario normal
  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  //Transaction
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  realBalance: number;
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  creditCardDebt: number;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];
}
