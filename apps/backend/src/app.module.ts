import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SlotsModule } from './modules/slots/slots.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { User } from './entities/user.entity';
import { Bet } from './entities/bet.entity';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'slots',
      password: process.env.DB_PASSWORD || 'slots_demo_2024',
      database: process.env.DB_NAME || 'slots_demo',
      entities: [User, Bet, Transaction],
      synchronize: true, // Only for demo! Use migrations in production
    }),
    AuthModule,
    UsersModule,
    SlotsModule,
    WalletModule,
  ],
})
export class AppModule {}
