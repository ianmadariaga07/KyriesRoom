import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubAccountDto } from './dto/create-sub-account.dto';
import { UpdateSubAccountDto } from './dto/update-sub-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubAccount } from './entities/sub-account.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SubAccountsService {
  constructor(
    @InjectRepository(SubAccount)
    private readonly subAccountRepository: Repository<SubAccount>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //si se usa un await dentro de una funcion esta debe de tener el async al inicio obligatoriamente
  async create(createSubAccountDto: CreateSubAccountDto) {
    const user = await this.userRepository.findOne({
      where: { id: createSubAccountDto.userId },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    const subAccount = this.subAccountRepository.create({
      ...createSubAccountDto,
      user: user,
    });

    await this.subAccountRepository.save(subAccount);

    return subAccount;
  }

  async findAll() {
    //Trae todas las subcuentas pero hace un join con la tabla de users
    return await this.subAccountRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: string) {
    const subAccount = await this.subAccountRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!subAccount) {
      throw new NotFoundException('No se ha encontrado la subcuenta');
    }
    return subAccount;
  }

  async update(id: string, updateSubAccountDto: UpdateSubAccountDto) {
    const subAccount = await this.findOne(id);
    //combina los datos actuales con los nuevos
    const updatedSubAccount = Object.assign(subAccount, updateSubAccountDto);
    return await this.subAccountRepository.save(updatedSubAccount);
  }

  async remove(id: string) {
    const subAccount = await this.findOne(id);
    await this.subAccountRepository.softRemove(subAccount);
    if (!subAccount) {
      throw new NotFoundException('No se ha encontrado la subcuenta');
    }
    return { message: 'Subcuenta eliminada logicamente' };
  }
}
