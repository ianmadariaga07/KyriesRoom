import {
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateSubAccountDto {
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  name: string;
  @IsNumber()
  realBalance: number;
  @IsNumber()
  creditCardDebt: number;
  @IsUUID()
  @IsString()
  userId: string;
}
