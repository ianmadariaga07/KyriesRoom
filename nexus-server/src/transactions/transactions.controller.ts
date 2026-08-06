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
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { AuthGuard } from '@nestjs/passport';
import express from 'express';

@UseGuards(AuthGuard('jwt'))
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: express.Request,
  ) {
    const user = req.user as { userId: string; email: string };
    return this.transactionsService.create(createTransactionDto, user.userId);
  }

  @Get()
  findAll(@Req() req: express.Request) {
    const user = req.user as { userId: string; email: string };
    return this.transactionsService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: express.Request) {
    const user = req.user as { userId: string; email: string };
    return this.transactionsService.findOne(id, user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: express.Request,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    const user = req.user as { userId: string; email: string };
    return this.transactionsService.update(
      id,
      updateTransactionDto,
      user.userId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: express.Request) {
    const user = req.user as { userId: string; email: string };
    return this.transactionsService.remove(id, user.userId);
  }
}
