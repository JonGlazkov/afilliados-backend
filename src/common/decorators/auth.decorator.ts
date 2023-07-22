import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt/jwt.guard';
import { RolesGuard } from '../guards/roles/roles.guard';

enum Role {
  AFFILIATED,
  CREATOR,
}

export function Auth(...role: Role[]) {
  return applyDecorators(
    SetMetadata('roles', role),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
}
