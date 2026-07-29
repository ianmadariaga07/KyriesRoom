import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    //en nuestra user entity habiamos puesto select: false para que cuando se pida el user no se traiga la
    //password, pero en este caso con select forzamos a que la traiga para
    //argon2 la compare. Igual tenemos que poner id y email para que tambien las traiga
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });

    if (!user) throw new UnauthorizedException();
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) throw new UnauthorizedException();

    return user;
  }

  //el estandar en JWT es poner sub de subject para el id del user
  login(user: { id: string; email: string }) {
    const payload = {
      email: user.email,
      sub: user.id,
    };

    return this.jwtService.sign(payload);
  }
}
