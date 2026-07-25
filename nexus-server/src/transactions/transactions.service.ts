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
    this.logicaSaldos(transaction, subAccount, amount);

    //primero guardamos la subcuenta y despues la transaccion
    await this.subAccountRepository.save(subAccount);
    await this.transactionRepository.save(transaction);
    return transaction;
  }

  findAll() {
    //Hacemos el JOIN con la tabla subAccounts {relations: ['subAccount'],
    //Esto hace un JOIN con la tabla subAccounts}
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
    const subAccount = transaction.subAccount;

    if (!subAccount)
      throw new NotFoundException('No se ha encontrado la subcuenta');

    this.limpiezaLogicaSaldos(transaction, subAccount);
    //combina los datos actuales con los nuevos
    const updateTransaction = Object.assign(transaction, updateTransactionDto);
    const updateAmount = Number(transaction.amount);

    if (updateTransaction.subAccountId !== subAccount.id) {
      const updatedSubAccount = await this.subAccountRepository.findOne({
        where: { id: updateTransaction.subAccountId },
      });

      if (!updatedSubAccount)
        throw new NotFoundException(
          'La nueva subcuenta seleccionada no existe',
        );

      updateTransaction.subAccount = updatedSubAccount;
      this.logicaSaldos(updateTransaction, updatedSubAccount, updateAmount);
      await this.subAccountRepository.save(subAccount);
      await this.subAccountRepository.save(updatedSubAccount);
    } else {
      this.logicaSaldos(updateTransaction, subAccount, updateAmount);
      await this.subAccountRepository.save(subAccount);
    }

    return await this.transactionRepository.save(updateTransaction);
  }

  async remove(id: string) {
    const transaction = await this.findOne(id);
    const subAccount = transaction.subAccount;

    if (!subAccount)
      throw new NotFoundException('No se ha encontrado la subcuenta');

    this.limpiezaLogicaSaldos(transaction, subAccount);

    await this.subAccountRepository.save(subAccount);
    await this.transactionRepository.softRemove(transaction);

    return { message: 'Transacción anulada correctamente' };
  }

  logicaSaldos(
    transaction: Transaction,
    subAccount: SubAccount,
    amount: number,
  ) {
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
  }

  limpiezaLogicaSaldos(transaction: Transaction, subAccount: SubAccount) {
    const amount = Number(transaction.amount);
    const currentRealBalance = Number(subAccount.realBalance);
    const currentCreditCardDebt = Number(subAccount.creditCardDebt);

    if (transaction.type === TransactionType.INCOME) {
      subAccount.realBalance = currentRealBalance - amount;
    } else if (transaction.type === TransactionType.EXPENSE) {
      if (transaction.isCreditCard) {
        subAccount.realBalance = currentRealBalance + amount;
        subAccount.creditCardDebt = currentCreditCardDebt - amount;
      } else {
        subAccount.realBalance = currentRealBalance + amount;
      }
    } else if (transaction.type === TransactionType.PAYMENT) {
      subAccount.creditCardDebt = currentCreditCardDebt + amount;
    } else {
      throw new NotFoundException(
        'No se ha realizado la transaccion. Intente de nuevo',
      );
    }
  }
}
