import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
@Injectable()
export class ApiGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {

        const req = context.switchToHttp().getRequest();
        const apiKey = req.headers["x-api-key"];

        if(!apiKey||apiKey!==process.env.API_KEY){
            throw new UnauthorizedException("Invalid api key",apiKey);
        }

        return true;
    }
}
