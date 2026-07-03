import { PartialType } from '@nestjs/mapped-types';
import { CreateSubAccountDto } from './create-sub-account.dto';

export class UpdateSubAccountDto extends PartialType(CreateSubAccountDto) {}
