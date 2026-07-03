import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { SubAccountsModule } from './sub-accounts/sub-accounts.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin123',
      database: 'nexus_db',
      entities: [],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    TransactionsModule,
    SubAccountsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
