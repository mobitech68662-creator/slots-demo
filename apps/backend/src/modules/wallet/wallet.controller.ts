import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('wallet')
@UseGuards(AuthGuard('jwt'))
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get('balance')
  async getBalance(@Request() req) {
    const balance = await this.walletService.getBalance(req.user.id);
    return { balance, user_id: req.user.id };
  }

  @Post('add-credits')
  async addCredits(@Request() req, @Body() body: { amount: number }) {
    const user = await this.walletService.addCredits(
      req.user.id,
      body.amount,
      'Manual credit addition',
    );
    return { balance: user.balance };
  }

  @Get('transactions')
  async getTransactions(@Request() req) {
    return this.walletService.getTransactions(req.user.id);
  }
}
