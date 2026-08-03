import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubAccountDto } from './dto/create-sub-account.dto';
import { UpdateSubAccountDto } from './dto/update-sub-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubAccount } from './entities/sub-account.entity';

@Injectable()
export class SubAccountsService {
  constructor(
    @InjectRepository(SubAccount)
    private readonly subAccountRepository: Repository<SubAccount>,
  ) {}

  //si se usa un await dentro de una funcion esta debe de tener el async al inicio obligatoriamente
  async create(createSubAccountDto: CreateSubAccountDto, userId: string) {
    //creamos la instancia de la subcuenta y le asignamos su dueño inmediatamente
    const subAccount = this.subAccountRepository.create({
      ...createSubAccountDto,
      user: { id: userId },
    });
    return await this.subAccountRepository.save(subAccount);
  }

  async findAll(userId: string) {
    //Trae todas las subcuentas pero hace un join con la tabla de users
    return await this.subAccountRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['user'],
    });
  }

  async findOne(id: string, userId: string) {
    const subAccount = await this.subAccountRepository.findOne({
      where: { id: id, user: { id: userId } },
      relations: ['user'],
    });

    if (!subAccount) {
      throw new NotFoundException(
        'No se ha encontrado la subcuenta o no tienes acceso',
      );
    }
    return subAccount;
  }

  async update(
    id: string,
    updateSubAccountDto: UpdateSubAccountDto,
    userId: string,
  ) {
    const subAccount = await this.findOne(id, userId);
    //combina los datos actuales con los nuevos
    const updatedSubAccount = Object.assign(subAccount, updateSubAccountDto);
    return await this.subAccountRepository.save(updatedSubAccount);
  }

  async remove(id: string, userId: string) {
    const subAccount = await this.findOne(id, userId);
    await this.subAccountRepository.softRemove(subAccount);
    if (!subAccount) {
      throw new NotFoundException('No se ha encontrado la subcuenta');
    }
    return { message: 'Subcuenta eliminada logicamente' };
  }
}
