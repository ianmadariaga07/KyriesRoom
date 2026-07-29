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
import * as argon2 from 'argon2';

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
      const hashPassword = await argon2.hash(createUserDto.password);
      //con el dto limpio el repositorio crea la instancia y la guarda en memoria. Todavia no pasa a la db
      //al usar los tres puntos (...) abrimos el objeto (createUSerDto) y le decimos que la propiedad password
      //la cambie por hashPassword
      //Copiamos un objeto y sobreescribimos una propiedad sin tener que ir linea por linea
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashPassword,
      });
      //guardamos en la db, el repositorio conecta con docker y hace un insert. Aqui se generan los datos faltantes
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      //código 23505 = Unique Violation, correo duplicado en Postgres
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === '23505') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    //combina los datos actuales con los nuevos
    const updatedUser = Object.assign(user, updateUserDto);
    return await this.userRepository.save(updatedUser);
  }

  //METODO DELETE
  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
