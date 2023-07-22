import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { TransactionService } from './transactions.service';
import { diskStorage } from 'multer';
import { Readable } from 'stream';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
    if (!file) {
      throw new HttpException('File not provided', HttpStatus.BAD_REQUEST);
    }

    const response = await this.transactionService.processSalesFile(
      file.buffer,
    );
    return response;
  }
}
