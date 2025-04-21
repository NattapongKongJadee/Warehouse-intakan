import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transactions.entities';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TransactionGateway } from './transaction.gateway';
import { Item } from 'src/items/items.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Item])],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionGateway],
  exports: [TransactionService],
})
export class TransactionModule {}
