import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { type Request } from 'express';
import { type TokenPayload, TokenUtility } from '@utils/token.utility';
@Injectable()
export class LoginProtectedGuard implements CanActivate {
    constructor(
        private readonly tokenUtility:TokenUtility
    ){}
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const req:Request = context.switchToHttp().getRequest();
        const token:string |null = this.tokenUtility.getToken(req);
        const decoded:TokenPayload = this.tokenUtility.verifyToken(token as string);
        if(!decoded.role&&decoded) return true;
        return false;
    }
}
