import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findById(+id);
    if (!user) throw new Error('User not found');
    const { password, ...result } = user;
    return result;
  }
}
