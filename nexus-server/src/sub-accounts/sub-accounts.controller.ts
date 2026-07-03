import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubAccountsService } from './sub-accounts.service';
import { CreateSubAccountDto } from './dto/create-sub-account.dto';
import { UpdateSubAccountDto } from './dto/update-sub-account.dto';

@Controller('sub-accounts')
export class SubAccountsController {
  constructor(private readonly subAccountsService: SubAccountsService) {}

  @Post()
  create(@Body() createSubAccountDto: CreateSubAccountDto) {
    return this.subAccountsService.create(createSubAccountDto);
  }

  @Get()
  findAll() {
    return this.subAccountsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subAccountsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubAccountDto: UpdateSubAccountDto,
  ) {
    return this.subAccountsService.update(id, updateSubAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subAccountsService.remove(id);
  }
}
