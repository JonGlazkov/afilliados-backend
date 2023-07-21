import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../guards/jwt/jwt.guard';
import { RolesGuard } from '../guards/roles/roles.guard';

export function Auth(...role: Role[]) {
  return applyDecorators(
    SetMetadata('roles', role),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
}
