import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { SubAccount } from '../../sub-accounts/entities/sub-account.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 20 })
  name;
  @Column({ type: 'varchar', length: 40 })
  lastName: string;
  @Column({ type: 'varchar', length: 50, nullable: true })
  nickname: string;
  @Column({ type: 'varchar', unique: true })
  email: string;
  //select:false es para que no traiga la password cuando pida el user
  @Column({ type: 'varchar', select: false })
  password: string;
  @Column({ type: 'bool', default: true })
  isActive: boolean;
  //admin o usuario normal
  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => SubAccount, (subAccount) => subAccount.user)
  subAccounts: SubAccount[];
}
