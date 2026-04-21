import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('bets')
export class Bet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.bets)
  user: User;

  @Column()
  user_id: number;

  @Column()
  game: string; // 'super_ace', 'fortune_gems', 'lucky_777'

  @Column({ default: 0 })
  bet_amount: number;

  @Column({ default: 0 })
  win_amount: number;

  @Column({ default: false })
  is_win: boolean;

  @Column({ nullable: true })
  result: string; // JSON string of game result

  @CreateDateColumn()
  created_at: Date;
}
