import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { SellerDto } from './sellers.dto';
import { SellersService } from './sellers.service';

@Controller('sellers')
export class SellersController {
  constructor(private sellersService: SellersService) {}

  @Get()
  async findAll(): Promise<SellerDto[]> {
    return this.sellersService.findAll();
  }

  @Post()
  async create(@Body() sellerDto: SellerDto): Promise<SellerDto> {
    return this.sellersService.create(sellerDto);
  }
  @Delete()
  async deleteSellers() {
    await this.sellersService.deleteSellers();
  }
}
