import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  //el logger es para ver los errores bonitos en terminal
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //METODO CREATE
  async create(createUserDto: CreateUserDto) {
    try {
      //con el dto limpio el repositorio crea la instancia y la guarda en memoria. Todavia no pasa a la db
      const user = this.userRepository.create(createUserDto);
      //guardamos en la db, el repositorio conecta con docker y hace un insert. Aqui se generan los datos faltantes
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      //código 23505 = Unique Violation, correo duplicado en Postgres
      if (error.code === '23505') {
        throw new BadRequestException(error.detail);
      }
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error inesperado, revisa los logs del servidor',
      );
    }
  }

  //METODO DE LECTURA, busca a todos los users
  findAll() {
    return this.userRepository.find();
  }
  //METODO DE LECTURA, busca por su id
  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException(`El usuario con id ${id} no existe`);
    }
    return user;
  }

  //METODO UPDATE
  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
  //METODO DELETE
  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
