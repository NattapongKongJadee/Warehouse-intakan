import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { StockService } from './stock.service';
import { Stock } from './stock.entities';
import { CreateStockDto } from './dto/create-stock';
import { ApiBody } from '@nestjs/swagger';

@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  findAll(): Promise<Stock[]> {
    return this.stockService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Stock | null> {
    return this.stockService.findOne(id);
  }

  @Post()
  @ApiBody({ type: CreateStockDto })
  create(@Body() stockData: CreateStockDto): Promise<Stock> {
    return this.stockService.create(stockData);
  }

  @Put(':id')
  async updateStock(
    @Param('id') id: string,
    @Body() stockData: Partial<Stock>,
  ): Promise<Stock> {
    return this.stockService.update(Number(id), stockData);
  }
}
