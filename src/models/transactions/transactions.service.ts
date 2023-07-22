import { Injectable } from '@nestjs/common';
import { Prisma, Transaction } from '@prisma/client';
import { PrismaService } from 'src/common/database/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async processSalesFile(fileContent: Buffer): Promise<any> {
    const fileLines = fileContent.toString().split('\n');
    const transactionsToCreate: Prisma.TransactionCreateInput[] = [];
    const successItems = [];
    const errorItems = [];

    // Process each line in the file
    for (let i = 0; i < fileLines.length; i++) {
      try {
        const line = fileLines[i];

        // Retrieve information from file
        const transactionType = parseInt(line[0], 10);
        const purchasedDateStr = line.substring(1, 27).trim();
        const product = line.substring(27, 57).trim();
        const value = parseInt(line.substring(57, 67), 10);
        const sellerName = line.substring(67).trim();

        // Datetime convert
        const purchasedDate = new Date(purchasedDateStr);

        // Seller (Creator or Affiliate)
        const sellerType =
          transactionType === 2 || transactionType === 3 ? 2 : 1;

        const transaction: Prisma.TransactionCreateInput = {
          seller: {
            connectOrCreate: {
              where: { name: sellerName },
              create: { name: sellerName, role: sellerType },
            },
          },
          sellerType,
          product,
          value: transactionType === 3 ? -value : value,
          date: purchasedDate,
          transactionType,
        };

        transactionsToCreate.push(transaction);

        successItems.push({
          line: `${i + 1} - ${line}`,
          message: 'Processed successfully',
        });
      } catch (e) {
        errorItems.push({
          line: `${i + 1} - ${e.line}`,
          message: e.message,
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
}
