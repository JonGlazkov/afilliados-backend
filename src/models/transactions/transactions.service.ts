import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Prisma, Seller, Transaction } from '@prisma/client';
import { PrismaService } from 'src/common/database/prisma.service';
import { Transactions } from './transactions.model';
import { async } from 'rxjs';
import { SellersService } from '../sellers/sellers.service';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async processTransactionsFile(fileContent: Buffer): Promise<any> {
    const fileLines = fileContent.toString().split('\n');
    const transactionsToCreate: Transactions[] = [];
    const successItems = [];
    const errorItems = [];

    // Process each line in the file
    for (let i = 0; i < fileLines.length; i++) {
      const line = fileLines[i].trim();
      if (line.length === 0) {
        continue;
      }

      try {
        const line = fileLines[i];
        const transactionType = parseInt(line[0], 10);
        const purchasedDateStr = line.substring(1, 26).trim();
        const product = line.substring(26, 56).trim();
        const value = parseInt(line.substring(56, 66), 10);
        const sellerName = line.substring(66).trim();

        const purchasedDate = new Date(purchasedDateStr);

        const sellerType =
          transactionType === 2 || transactionType === 3 ? 2 : 1;

        const existingSeller = await this.prisma.seller.findFirst({
          where: {
            name: sellerName,
            role: sellerType,
          },
        });

        let sellerId: string;

        if (!existingSeller) {
          const newSeller = await this.prisma.seller.create({
            data: { name: sellerName, role: sellerType },
          });
          console.log('New seller created:', newSeller);
          sellerId = newSeller.id;
        } else {
          sellerId = existingSeller.id;
        }

        const transaction: Transactions = {
          sellerName,
          sellerType,
          product,
          value: transactionType === 3 ? -value : value,
          date: purchasedDate,
          transactionType,
          sellerId,
        };

        transactionsToCreate.push(transaction);

        successItems.push({
          line: `${i + 1} - ${line}`,
          message: 'Processed successfully',
        });
      } catch (e) {
        console.error('Erro no processamento do arquivo', e);
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        errorItems.push({
          line: `${i + 1} - ${fileLines[i]}`,
          message: errorMessage,
        });
      }
    }

    await this.prisma.transaction.createMany({
      data: transactionsToCreate,
    });

    const response = { successItems, errorItems };
    return response;
  }

  async listTransactions(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany();
  }

  async listTransactionBySellerId(id: string): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: {
        sellerId: id,
      },
      include: { seller: true },
    });
  }

  async deleteTransactions() {
    return this.prisma.transaction.deleteMany({});
  }
}
