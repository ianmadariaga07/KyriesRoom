import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionType } from './entities/transaction.entity';
import { SubAccount } from '../sub-accounts/entities/sub-account.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(SubAccount)
    private readonly subAccountRepository: Repository<SubAccount>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const subAccount = await this.subAccountRepository.findOne({
      where: { id: createTransactionDto.subAccountId },
    });

    if (!subAccount)
      throw new NotFoundException('No se ha encontrado la subcuenta');

    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      subAccount: subAccount,
    });

    //LOGICA DE SALDOS
    const amount = Number(createTransactionDto.amount);

    const currentRealBalance = Number(subAccount.realBalance);
    const currentCreditCardDebt = Number(subAccount.creditCardDebt);

    if (transaction.type === TransactionType.INCOME) {
      subAccount.realBalance = currentRealBalance + amount;
    } else if (transaction.type === TransactionType.EXPENSE) {
      if (transaction.isCreditCard) {
        subAccount.realBalance = currentRealBalance - amount;
        subAccount.creditCardDebt = currentCreditCardDebt + amount;
      } else {
        subAccount.realBalance = currentRealBalance - amount;
      }
    } else if (transaction.type === TransactionType.PAYMENT) {
      subAccount.creditCardDebt = currentCreditCardDebt - amount;
    } else {
      throw new NotFoundException(
        'No se ha realizado la transaccion. Intente de nuevo',
      );
    }
    //primero guardamos la subcuenta y despues la transaccion
    await this.subAccountRepository.save(subAccount);
    await this.transactionRepository.save(transaction);

    return transaction;
  }

  findAll() {
    //Hacemos el JOIN con la tabla subAccounts {relations: ['subAccount'], // Esto hace un JOIN con la tabla subAccounts}
    return this.transactionRepository.find({
      relations: ['subAccount'],
      order: {
        transactionDate: 'DESC',
      },
    });
  }

  async findOne(id: string) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['subAccount'],
    });
    if (!transaction) {
      throw new NotFoundException('No se ha encontrado la transaccion');
    }
    return transaction;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.findOne(id);
    //combina los datos actuales con los nuevos
    const updatedTransaction = Object.assign(transaction, updateTransactionDto);
    return await this.transactionRepository.save(updatedTransaction);
  }

  async remove(id: string) {
    const transaction = await this.findOne(id);
    //hacemos soft remove
    await this.transactionRepository.softRemove(transaction);
    return { message: 'Transacción anulada correctamente' };
  }
}
