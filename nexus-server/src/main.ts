import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //validacion global
  app.setGlobalPrefix('api'); //esto hace que las rutas sean /api/, pero es opcional
  app.useGlobalPipes(
    new ValidationPipe({
      //elimina los datos extra que no estén en los DTO
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
