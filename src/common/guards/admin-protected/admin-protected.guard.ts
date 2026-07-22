import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '@decorator/roles.decorator';
import { Role } from '@enums/auth.enum';

@Injectable()
export class AdminProtectedGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();

        const roleFromHeader = request.headers['user-role'];

        if (!roleFromHeader) {
            return false;
        }

        return requiredRoles.includes(roleFromHeader as Role);
  }
}
