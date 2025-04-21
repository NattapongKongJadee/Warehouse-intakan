import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './stock.entities';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) {}

  async findAll(): Promise<Stock[]> {
    return this.stockRepository.find({ relations: ['item'] });
  }

  async findOne(id: number): Promise<Stock | null> {
    return this.stockRepository.findOne({ where: { id }, relations: ['item'] });
  }

  async create(stockData: Partial<Stock>): Promise<Stock> {
    const stock = this.stockRepository.create(stockData);
    return this.stockRepository.save(stock);
  }

  async update(id: number, stockData: Partial<Stock>): Promise<Stock> {
    await this.stockRepository.update(id, stockData);

    const updatedStock = await this.stockRepository.findOne({ where: { id } });

    if (!updatedStock) {
      throw new NotFoundException(`Stock with ID ${id} not found`);
    }

    return updatedStock;
  }
}
