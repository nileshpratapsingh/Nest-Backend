import { LoginProtectedGuard } from '@guards/login-protected/login-protected.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { Role } from '@enums/auth.enum';

export function UserOnly() {
  return applyDecorators(Roles(Role.USER), UseGuards(LoginProtectedGuard));
}
