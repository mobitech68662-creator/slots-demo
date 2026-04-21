import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { SlotsService } from './slots.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('slots')
@UseGuards(AuthGuard('jwt'))
export class SlotsController {
  constructor(private slotsService: SlotsService) {}

  @Post('spin')
  async spin(@Request() req, @Body() body: { game: string; betAmount: number }) {
    return this.slotsService.spin(body.game, body.betAmount, req.user.id);
  }

  @Get('history')
  async getHistory(@Request() req, @Param('limit') limit?: string) {
    return this.slotsService.getBetHistory(req.user.id, limit ? parseInt(limit) : 20);
  }

  @Get('games')
  getGames() {
    return [
      { id: 'super_ace', name: 'Super Ace', icon: '🃏', description: 'Classic card slots' },
      { id: 'fortune_gems', name: 'Fortune Gems', icon: '💎', description: 'Gem matching slots' },
      { id: 'lucky_777', name: 'Lucky 777', icon: '🎰', description: 'Traditional 777 slots' },
    ];
  }
}
