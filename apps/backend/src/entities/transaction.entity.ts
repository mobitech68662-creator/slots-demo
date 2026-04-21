import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.transactions)
  user: User;

  @Column()
  user_id: number;

  @Column()
  amount: number;

  @Column()
  type: string; // 'credit', 'debit', 'win', 'loss'

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;
}
