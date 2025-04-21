import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Item } from 'src/items/items.entities';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'itemId' }) // ✅ ตั้งชื่อ Foreign Key ให้เป็น itemId
  item: Item;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ nullable: true })
  warehouseLocation: string;
}
