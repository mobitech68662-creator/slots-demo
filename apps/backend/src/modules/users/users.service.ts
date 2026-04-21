import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(username: string, email: string, password: string) {
    const user = this.usersRepository.create({ username, email, password });
    return this.usersRepository.save(user);
  }

  async findByUsername(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  async updateBalance(userId: number, balance: number) {
    await this.usersRepository.update(userId, { balance });
    return this.usersRepository.findOne({ where: { id: userId } });
  }
}
