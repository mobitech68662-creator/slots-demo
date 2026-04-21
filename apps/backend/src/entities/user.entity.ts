import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Bet } from './bet.entity';
import { Transaction } from './transaction.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 10000 })
  balance: number; // Virtual credits

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Bet, bet => bet.user)
  bets: Bet[];

  @OneToMany(() => Transaction, transaction => transaction.user)
  transactions: Transaction[];
}
