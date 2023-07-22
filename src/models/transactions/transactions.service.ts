import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Prisma, Seller, Transaction } from '@prisma/client';
import { PrismaService } from 'src/common/database/prisma.service';
import { Transactions } from './transactions.model';
import { async } from 'rxjs';

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

        // Retrieve information from file
        const transactionType = parseInt(line[0], 10);
        const purchasedDateStr = line.substring(1, 26).trim();
        const product = line.substring(26, 56).trim();
        const value = parseInt(line.substring(56, 66), 10);
        const sellerName = line.substring(66).trim();

        // Datetime convert
        const purchasedDate = new Date(purchasedDateStr);

        // Seller (Creator or Affiliate)
        const sellerType =
          transactionType === 2 || transactionType === 3 ? 2 : 1;

        const transaction: Transactions = {
          sellerName,
          sellerType,
          product,
          value: transactionType === 3 ? -value : value,
          date: purchasedDate, // Use Date type directly
          transactionType,
        };

        transactionsToCreate.push(transaction);

        const existingSeller = await this.prisma.seller.findFirst({
          where: {
            name: sellerName,
            role: sellerType,
          },
        });

        // If the seller doesn't exist, create a new one
        if (!existingSeller) {
          const newSeller = await this.prisma.seller.create({
            data: { name: sellerName, role: sellerType },
          });
          console.log('New seller created:', newSeller);
        }

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

    // Bulk creating SalesTransaction

    await this.prisma.transaction.createMany({
      data: transactionsToCreate,
    });

    const response = { successItems, errorItems };
    return response;
  }

  async listTransactions(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany();
  }

  async deleteTransactions() {
    return this.prisma.transaction.deleteMany({});
  }
}
