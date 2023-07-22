import { Module } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { SellersController } from './sellers.controller';
import { SellersService } from './sellers.service';

@Module({
  controllers: [SellersController],
  providers: [PrismaService, SellersService],
})
export class SellersModule {}
