import { Prisma, Seller } from '@prisma/client';

type sellerType = {
  1: 'CREATOR';
  2: 'AFFILIATED';
};

type transactionType = {
  1: 'CREATOR_SALE';
  2: 'AFFILIATED_SALE';
  3: 'COMMISSION_PAID';
  4: 'COMMISSION_RECEIVED';
};

export class Transactions {
  sellerName: string;
  sellerType: number;
  product: string;
  value: number;
  date: Date;
  transactionType: number;
}
