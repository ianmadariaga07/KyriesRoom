import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsArray,
  MaxLength,
} from 'class-validator';

//los tipos de datos deben de coincidir con nuestra entidad/tabla
export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsOptional()
  @IsArray()
  roles?: string[];
}
