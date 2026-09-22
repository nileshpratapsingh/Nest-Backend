import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { TokenUtility } from '@utils/token.utility';
import { Request } from 'express';

@Injectable()
export class LoginRestrictionGuard implements CanActivate {
    constructor(
        private readonly tokenUtility:TokenUtility
    ){}
    canActivate(context: ExecutionContext): boolean {
        const req:Request = context.switchToHttp().getRequest<Request>();

        const authHeader = req.headers.authorization;

        const refreshToken =
            req.cookies?.refreshToken ??
                (authHeader?.startsWith('Bearer ')
                    ? authHeader.substring(7)
                    : authHeader);

        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not found');
        }

        const verify = this.tokenUtility.verifyToken(refreshToken);
        if(!verify) return false;

        return true;
    }
}
