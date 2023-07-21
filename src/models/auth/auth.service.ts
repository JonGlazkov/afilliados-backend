import { PrismaService } from 'src/common/database/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthLoginInput } from './entity/login.input';
import { NotFoundException } from '@nestjs/common';
import { comparePassword, hashPassword } from 'src/common/helpers/crypto';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';
import { AuthLoginDto } from './entity/login.dto';
import { ChangePasswordInput } from './entity/change-password.input';
import { passwordValidator } from 'src/common/helpers/passwordValidator';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async jwtToken(user: Users): Promise<AuthLoginDto> {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: payload,
    };
  }

  async login({ email, password }: AuthLoginInput): Promise<AuthLoginDto> {
    const user = await this.prisma.users.findFirst({ where: { email } });

    if (!user) throw new NotFoundException('Este usuário não existe');

    if (!comparePassword(password, user.password))
      throw new UnauthorizedException('Credenciais incorretas');

    return this.jwtToken(user);
  }

  async getAccount(access_token: string): Promise<any> {
    const user = this.jwtService.decode(access_token, { json: true });
    return user;
  }

  async changePassword(
    id: string,
    data: ChangePasswordInput,
  ): Promise<Users | any> {
    const findUser = await this.prisma.users.findFirst({
      where: {
        id,
      },
    });

    if (!findUser) throw new BadRequestException('Este usuário não existe');

    if (data.password !== data.confirmationPassword)
      throw new BadRequestException('As senhas estão diferentes');

    const validatePassword = passwordValidator(data.password);

    if (!validatePassword.passed)
      throw new BadRequestException(validatePassword.error);

    delete data.confirmationPassword;
    const password = hashPassword(data.password);
    data.password = password;

    return await this.prisma.users.update({
      where: {
        id,
      },
      data: {
        password: data.password,
      },
    });
  }
}
