import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import express from 'express';
import { CreateAuthDto } from './dto/auth-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: CreateAuthDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    //validamos el user
    const userValidado = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    //traemos el servicio para validar al usuario y generar el token
    const token = this.authService.login(userValidado);

    //inyectamos la cookie
    res.cookie('access_token', token, {
      //antihackeo, cero ejecucion de codigo
      httpOnly: true,
      //false mientras desarrollamos en localhost. En produccion (Vercel/Render) debe ser true
      //en local es http y en produccion es https, por eso de momento es false
      secure: false,
      //proteccion contra ataques CSRF, escudo antiphising
      sameSite: 'lax',
      //tiempo de vida de la cookie, 1 día en milisegundos
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { message: 'Login exitoso', userId: userValidado.id };
  }
}
