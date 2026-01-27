import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @IsNumber()
  @IsPositive()
  amount: number;
  @IsEnum(TransactionType)
  type: TransactionType;
  @IsOptional()
  @IsBoolean()
  isCreditCard: boolean;
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  concept: string;
  @IsOptional()
  description: string;
  @IsDateString()
  @IsOptional()
  transactionDate: string;
  @IsUUID()
  @IsString()
  userId: string;
}
