import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { TokenPayload } from '@custom_types/tokenPayload.types';
import { ENV } from '@enums/environment-variable.enum';

@Injectable()
export class TokenUtility {

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    generateAccessToken(tokenPayload:TokenPayload):string{
        if(!tokenPayload) throw new Error("Access token Payload missing !!\nSend payload to generate the token.");
        const options : JwtSignOptions ={
            secret:this.configService.get<string>(ENV.JWT_ACCESS_SECRET),
            expiresIn:this.configService.get<number>(ENV.JWT_ACCESS_EXPIRES) ??"15m"
        };
        return this.jwtService.sign(tokenPayload, options);
    }

    generateRefreshToken(tokenPayload:TokenPayload):string{

        if(!tokenPayload) throw new Error("Access token Payload missing !!\nSend payload to generate the token.");
        const options: JwtSignOptions = {
            secret: this.configService.get<string>(ENV.JWT_REFRESH_SECRET),
            expiresIn: this.configService.get<number>(ENV.JWT_REFRESH_EXPIRES) ?? "7d",
        };
        return this.jwtService.sign(tokenPayload, options);
    }

    verifyToken(token:string):TokenPayload|null{
        if(!token) return null;
        try {
            return this.jwtService.verify<TokenPayload>(token,{
                secret:this.configService.get<string>(ENV.JWT_ACCESS_SECRET)
            });
        } catch(err) {
            try {
                return this.jwtService.verify<TokenPayload>(token,{
                    secret:this.configService.get<string>(ENV.JWT_REFRESH_SECRET)
                });
            } catch (err) {
                throw new UnauthorizedException(err);
            }
        };

    }

    decodeToken(token:string):TokenPayload|null{
        if(!token) return null;
        const verify = this.verifyToken(token);
        if(!verify) return null;
        return this.jwtService.decode<TokenPayload>(token);
    }

    getToken(req:Request):string|null{
        let token:string|undefined;
        try {
            token = req.headers?.authorization;
            // if(!token) throw new NotFoundException("Token Not Found");
        } catch (error) {
            try {
                token = req.cookies?.accessToken || req.cookies?.refreshToken;
            } catch (error) {
                throw new Error("Error Getting token!!")
            }
        }
        return token||null;
    }

    getAccessToken(req:Request):string|null{
        let accessToken:string;
        accessToken = req.cookies?.accessToken || req.headers?.authorization;
        if(!accessToken) return null;
        return accessToken;
    }

    getRefreshToken(req:Request):string|null{
        let refreshToken:string;
        refreshToken = req.cookies?.refreshToken || req.headers?.authorization;
        if(!refreshToken) return null;
        return refreshToken;
    }
}
