import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity('sub_accounts')
export class SubAccount {
  //se usa un string con un UUID (Universally Unique Identifier) por seguridad
  //un number o int es peligroso por un ataque IDOR
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 40 })
  name: string;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  realBalance: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  creditCardDebt: number;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;

  //RELACION muchas subcuentas pertenecen a 1 Usuario
  @ManyToOne(() => User, (user) => user.subAccounts, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  //RELACION 1 subcuenta tiene muchas Transacciones
  @OneToMany(() => Transaction, (transaction) => transaction.subAccount)
  transactions: Transaction[];
}
