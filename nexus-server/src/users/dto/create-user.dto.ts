import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsArray,
  MaxLength,
  IsBoolean,
} from 'class-validator';

//los tipos de datos deben de coincidir con nuestra entidad/tabla
export class CreateUserDto {
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  name: string;
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  lastName: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  //el ? se usa para indicar que es opcional
  @IsOptional()
  @IsArray()
  roles?: string[];
}
