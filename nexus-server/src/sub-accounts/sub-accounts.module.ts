import { Module } from '@nestjs/common';
import { SubAccountsService } from './sub-accounts.service';
import { SubAccountsController } from './sub-accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../transactions/entities/transaction.entity';
import { User } from '../users/entities/user.entity';
import { SubAccount } from './entities/sub-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubAccount, Transaction, User])],
  controllers: [SubAccountsController],
  providers: [SubAccountsService],
})
export class SubAccountsModule {}
