import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger'
import { User } from "../interface/user.interface";

export class AuthLoginDto {
  @ApiProperty()
  @IsString()
  access_token: string;

  @ApiProperty()
  @IsNotEmpty()
  user: User;
}
