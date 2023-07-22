import { Module } from '@nestjs/common';
import { TransactionController } from './transactions.controller';
import { TransactionService } from './transactions.service';
import { PrismaService } from 'src/common/database/prisma.service';

@Module({
  controllers: [TransactionController],
  providers: [PrismaService, TransactionService],
})
export class TransactionsModule {}
