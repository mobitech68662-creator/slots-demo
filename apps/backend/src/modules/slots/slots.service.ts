import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bet } from '../entities/bet.entity';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class SlotsService {
  constructor(
    @InjectRepository(Bet)
    private betsRepository: Repository<Bet>,
    private walletService: WalletService,
  ) {}

  // Slot symbols and their values
  private symbols = {
    super_ace: ['🂡', '🂫', '👸', '🂮', '💎'], // Ace, King, Queen, Jack, Diamond
    fortune_gems: ['💎', '🔷', '🔶', '💠', '⭐'],
    lucky_777: ['7️⃣', '🍒', '🍋', '🍊', '🔔'],
  };

  private payouts = {
    super_ace: { '🂡': 10, '🂫': 5, '👸': 3, '🂮': 2, '💎': 50 },
    fortune_gems: { '💎': 50, '🔷': 10, '🔶': 8, '💠': 5, '⭐': 3 },
    lucky_777: { '7️⃣': 100, '🍒': 5, '🍋': 3, '🍊': 4, '🔔': 10 },
  };

  async spin(game: string, betAmount: number, userId: number) {
    if (!this.symbols[game]) {
      throw new Error('Invalid game');
    }

    // Spin the reels (3 reels)
    const reels = [
      this.getRandomSymbol(game),
      this.getRandomSymbol(game),
      this.getRandomSymbol(game),
    ];

    // Calculate win
    const winAmount = this.calculateWin(game, reels, betAmount);
    const isWin = winAmount > 0;

    // Update user balance
    await this.walletService.updateBalance(userId, -betAmount + winAmount);

    // Save bet
    const bet = this.betsRepository.create({
      user_id: userId,
      game,
      bet_amount: betAmount,
      win_amount: winAmount,
      is_win: isWin,
      result: JSON.stringify({ reels }),
    });

    await this.betsRepository.save(bet);

    return {
      reels,
      win_amount: winAmount,
      is_win: isWin,
      bet_id: bet.id,
    };
  }

  private getRandomSymbol(game: string): string {
    const symbols = this.symbols[game];
    const weights = this.getWeights(game);
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < symbols.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return symbols[i];
      }
    }
    return symbols[0];
  }

  private getWeights(game: string): number[] {
    // Higher weight = more common
    switch (game) {
      case 'super_ace':
        return [10, 15, 20, 25, 5]; // Diamond is rare
      case 'fortune_gems':
        return [5, 15, 15, 20, 25];
      case 'lucky_777':
        return [5, 25, 25, 20, 15]; // 7 is rare
      default:
        return [20, 20, 20, 20, 20];
    }
  }

  private calculateWin(game: string, reels: string[], betAmount: number): number {
    const payout = this.payouts[game];
    
    // All 3 same - big win
    if (reels[0] === reels[1] && reels[1] === reels[2]) {
      return betAmount * payout[reels[0]] * 3;
    }
    
    // 2 same - small win
    if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
      const matchingSymbol = reels[0] === reels[1] ? reels[0] : 
                            reels[1] === reels[2] ? reels[1] : reels[0];
      return betAmount * payout[matchingSymbol];
    }
    
    return 0;
  }

  async getBetHistory(userId: number, limit = 20) {
    return this.betsRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      take: limit,
    });
  }
}
