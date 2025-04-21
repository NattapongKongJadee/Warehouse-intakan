import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Item } from 'src/items/items.entities';
import { User } from 'src/users/user.entities';
import { Project } from 'src/project-tracking/project.entities';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Item, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Project, { eager: true, nullable: true })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @Column()
  itemId: number;

  @Column({
    type: 'enum',
    enum: ['update', 'withdraw', 'return', 'burrow', 'useForWork'],
  })
  type: 'update' | 'withdraw' | 'return' | 'burrow' | 'useForWork';

  @Column()
  quantity: number;

  @Column()
  remark: string;

  @CreateDateColumn()
  created_at: Date;
}
