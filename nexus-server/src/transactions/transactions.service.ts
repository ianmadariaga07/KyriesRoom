import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionType } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const user = await this.userRepository.findOne({
      where: { id: createTransactionDto.userId },
    });

    if (!user) throw new NotFoundException('No se ha encontrado el usuario');
    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      user: user,
    });

    //LOGICA DE SALDOS
    const amount = Number(createTransactionDto.amount);

    const currentRealBalance = Number(user.realBalance);
    const currentCreditCardDebt = Number(user.creditCardDebt);

    if (transaction.type === TransactionType.INCOME) {
      user.realBalance = currentRealBalance + amount;
    } else if (transaction.type === TransactionType.EXPENSE) {
      if (transaction.isCreditCard) {
        user.realBalance = currentRealBalance - amount;
        user.creditCardDebt = currentCreditCardDebt + amount;
      } else {
        user.realBalance = currentRealBalance - amount;
      }
    } else if (transaction.type === TransactionType.PAYMENT) {
      user.creditCardDebt = currentCreditCardDebt - amount;
    } else {
      throw new NotFoundException(
        'No se ha realizado la transaccion. Intente de nuevo',
      );
    }

    await this.userRepository.save(user);
    await this.transactionRepository.save(transaction);

    return transaction;
  }

  findAll() {
    return this.transactionRepository.find();
  }

  async findOne(id: string) {
    const transaction = await this.transactionRepository.findOneBy({ id });
    if (!transaction) {
      throw new NotFoundException('No se ha encontrado el usuario');
    }
    return transaction;
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: string) {
    return `This action removes a #${id} transaction`;
  }
}
