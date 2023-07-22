import { Module } from '@nestjs/common';
import { AuthService } from './models/auth/auth.service';
import { JwtStrategy } from './common/guards/jwt/jwt.strategy';
import { AuthModule } from './models/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './common/database/prisma.service';
import { TransactionsModule } from './models/transactions/transactions.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    AuthModule,
    JwtModule,
    PassportModule,
    MulterModule,
    TransactionsModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  providers: [PrismaService, AuthService, JwtStrategy],
})
export class AppModule {}
