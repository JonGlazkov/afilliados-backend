import { Body, Controller, Get, Post, Headers, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginInput } from './entity/login.input';
import { AuthLoginDto } from './entity/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from './interface/user.interface';
import { Auth } from 'src/common/decorators/auth.decorator';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('account')
  @Auth()
  async getAccount(@Headers() headers): Promise<User> {
    return await this.authService.getAccount(
      headers.authorization.split(' ')[1],
    );
  }

  @Post('login')
  async login(@Body() data: AuthLoginInput): Promise<AuthLoginDto> {
    return await this.authService.login(data);
  }
}
