import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './transactions.entities';
import { ApiQuery } from '@nestjs/swagger';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 20,
  ): Promise<{
    data: Transaction[];
    total: number;
    page: number;
    pageCount: number;
  }> {
    return this.transactionService.findAll({ page, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Transaction | null> {
    return this.transactionService.findOne(id);
  }

  @Get('item/:itemId')
  getTransactionsByItem(
    @Param('itemId') itemId: number,
    @Query('limit', ParseIntPipe) limit = 10,
  ): Promise<Transaction[]> {
    return this.transactionService.findByItemId(itemId, limit);
  }

  @Post()
  create(@Body() transactionData: Partial<Transaction>): Promise<Transaction> {
    return this.transactionService.create(transactionData);
  }
}
