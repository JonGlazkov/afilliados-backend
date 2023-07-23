import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma.service';
import { SellerDto } from './sellers.dto';
import { Seller } from '@prisma/client';

@Injectable()
export class SellersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Seller[]> {
    const sellers = await this.prisma.seller.findMany({
      include: {
        transactions: true,
      },
    });

    return sellers;
  }

  async create(sellerDto: SellerDto): Promise<SellerDto> {
    const createdSeller = await this.prisma.seller.create({ data: sellerDto });
    return { name: createdSeller.name, role: createdSeller.role };
  }

  async deleteSellers() {
    return this.prisma.seller.deleteMany({});
  }
}
