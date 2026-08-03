import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SubAccountsService } from './sub-accounts.service';
import { CreateSubAccountDto } from './dto/create-sub-account.dto';
import { UpdateSubAccountDto } from './dto/update-sub-account.dto';
import { AuthGuard } from '@nestjs/passport';
import express from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('sub-accounts')
export class SubAccountsController {
  constructor(private readonly subAccountsService: SubAccountsService) {}

  @Post()
  create(
    @Body() createSubAccountDto: CreateSubAccountDto,
    @Req() req: express.Request,
  ) {
    const user = req.user as { userId: string; email: string };
    return this.subAccountsService.create(createSubAccountDto, user.userId);
  }

  @Get()
  findAll(@Req() req: express.Request) {
    const user = req.user as { userId: string; email: string };
    return this.subAccountsService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: express.Request) {
    const user = req.user as { userId: string; email: string };
    // Pasamos el ID de la subcuenta y el ID del usuario
    return this.subAccountsService.findOne(id, user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: express.Request,
    @Body() updateSubAccountDto: UpdateSubAccountDto,
  ) {
    const user = req.user as { userId: string; email: string };
    return this.subAccountsService.update(id, updateSubAccountDto, user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: express.Request) {
    const user = req.user as { userId: string; email: string };
    return this.subAccountsService.remove(id, user.userId);
  }
}
