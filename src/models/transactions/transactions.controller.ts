import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { TransactionService } from './transactions.service';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new HttpException('File not provided', HttpStatus.BAD_REQUEST);
    }

    const response = await this.transactionService.processTransactionsFile(
      file.buffer,
    );
    return response;
  }

  @Get()
  async listTransactions(): Promise<any> {
    const transactions = await this.transactionService.listTransactions();

    if (!transactions) {
      return 'No transactions';
    }

    const total = transactions.reduce(
      (sum, transaction) => sum + transaction.value,
      0,
    );

    return { transactions, total };
  }
  @Delete()
  async deleteTransactions() {
    await this.transactionService.deleteTransactions();
  }
}
