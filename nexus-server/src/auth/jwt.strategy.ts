import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKey: 'palabra-secreta-segura',
      ignoreExpiration: false,

      jwtFromRequest: (req: Request) => {
        //Recibe la peticion HTTP que viene de Angular
        let token: string | null = null;
        //Si la petición existe y el cookie-parser ya encontro cookies adentro
        if (req && req.cookies) {
          //Saca solo la cookie llamada access_token
          const cookies = req.cookies as Record<string, string>;
          token = cookies['access_token'];
        }
        // Se lo devolvemos a Passport para que lo valide
        return token;
      },
    });
  }

  validate(payload: { sub: string; email: string }) {
    return { userId: payload.sub, email: payload.email };
  }
}
