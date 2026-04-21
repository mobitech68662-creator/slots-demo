import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bet } from '../entities/bet.entity';
import { User } from '../entities/user.entity';
import { SlotsController } from './slots.controller';
import { SlotsService } from './slots.service';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bet, User]),
    WalletModule,
  ],
  controllers: [SlotsController],
  providers: [SlotsService],
  exports: [SlotsService],
})
export class SlotsModule {}
