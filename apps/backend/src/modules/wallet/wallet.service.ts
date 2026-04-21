import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async getBalance(userId: number): Promise<number> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    return user?.balance || 0;
  }

  async updateBalance(userId: number, amount: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const newBalance = user.balance + amount;
    if (newBalance < 0) {
      throw new Error('Insufficient balance');
    }

    user.balance = newBalance;
    await this.usersRepository.save(user);

    // Record transaction
    const transaction = this.transactionsRepository.create({
      user_id: userId,
      amount,
      type: amount > 0 ? 'credit' : 'debit',
      description: amount > 0 ? 'Win' : 'Bet placed',
    });
    await this.transactionsRepository.save(transaction);

    return user;
  }

  async addCredits(userId: number, amount: number, description = 'Demo credits'): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    user.balance += amount;
    await this.usersRepository.save(user);

    const transaction = this.transactionsRepository.create({
      user_id: userId,
      amount,
      type: 'credit',
      description,
    });
    await this.transactionsRepository.save(transaction);

    return user;
  }

  async getTransactions(userId: number, limit = 20) {
    return this.transactionsRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      take: limit,
    });
  }
}
