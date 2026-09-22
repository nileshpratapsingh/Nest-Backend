import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { Role } from '@enums/auth.enum';
import { AdminProtectedGuard } from '@guards/admin-protected/admin-protected.guard';

export function AdminOnly() {
  return applyDecorators(
    UseGuards(AdminProtectedGuard),
    Roles(Role.ADMIN, Role.SUPER_ADMIN),
  );
}
