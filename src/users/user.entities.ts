import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  WAREHOUSE_STAFF = 'warehouse_staff',
  REQUESTER = 'requester',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string; // 🔒 Hash this in production

  @Column({ type: 'enum', enum: UserRole, default: UserRole.REQUESTER })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;
}
