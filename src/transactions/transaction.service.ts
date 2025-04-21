import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transactions.entities';
import { TransactionGateway } from './transaction.gateway';
import { Item } from 'src/items/items.entities';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(Item) // 👈 ตรงนี้คือ index [1]
    private itemRepository: Repository<Item>,

    private transactionGateway: TransactionGateway,
  ) {}

  async findAll(options: { page: number; limit: number }) {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const where: any = {}; // สามารถเพิ่ม filter ภายหลังได้
    const [transactions, total] = await this.transactionRepository.findAndCount(
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        where,
        take: limit,
        skip,
        order: { created_at: 'DESC' },
      },
    );

    return {
      data: transactions,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return transaction;
  }

  async findByItemId(itemId: number, limit = 10): Promise<Transaction[]> {
    const transactions = await this.transactionRepository.find({
      where: { itemId },
      take: limit,
      order: { created_at: 'DESC' }, // ✅ Sort by latest transaction first
    });

    if (!transactions || transactions.length === 0) {
      throw new NotFoundException(
        `No transactions found for item ID ${itemId}`,
      );
    }

    return transactions;
  }

  async create(data: Partial<Transaction>): Promise<Transaction> {
    const transaction = this.transactionRepository.create(data);
    const saved = await this.transactionRepository.save(transaction);
    const item = await this.itemRepository.findOneBy({ id: saved.itemId });

    if (!item) {
      throw new NotFoundException(`Item with ID ${saved.itemId} not found`);
    }

    this.transactionGateway.emitTransactionCreated({
      ...saved,
      item, // ✅ now guaranteed to be Item
    });

    return saved;
  }
}
