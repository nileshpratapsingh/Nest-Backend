import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { type Request } from 'express';
import { Types } from 'mongoose';

export interface TokenPayload {
    userId: string | Types.ObjectId;
    email: string;
    role?: string;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

@Injectable()
export class TokenUtility {

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    genrateAccessToken(tokenPayload:TokenPayload):string{
        if(!tokenPayload) throw new Error("Access token Payload missing!!");
        const options : JwtSignOptions ={
            secret:this.configService.get<string>("JWT_ACCESS_SECRET"),
            expiresIn:this.configService.get<number>("JWT_ACCESS_EXPIRE") ??"15m"
        };
        return this.jwtService.sign(tokenPayload, options);
    }

    generateRefreshToken(tokenPayload:TokenPayload):string{

        if(!tokenPayload) throw new Error("Access token Payload missing!!");
        const options: JwtSignOptions = {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get<number>('JWT_REFRESH_EXPIRE') ?? "7d",
        };
        return this.jwtService.sign(tokenPayload, options);
    }

    verifyToken(token:string){
        if(!token) throw new Error("Token Missing to verify!!");
        try {
            return this.jwtService.verify<TokenPayload>(token,{
                secret:this.configService.get<string>("JWT_ACCESS_SECRET")
            });
        } catch(err) {
            try {
                return this.jwtService.verify<TokenPayload>(token,{
                    secret:this.configService.get<string>("JWT_REFRESH_SECRET")
                });
            } catch (err) {
                throw new UnauthorizedException(err);
            }
        };

    }

    decodeToken(token:string):TokenPayload{
        if(!token) throw new Error("Token Missing for decode");
        return this.jwtService.decode<TokenPayload>(token);
    }

    getToken(req:Request):string|null{
        let token:string|undefined;
        try {
            token = req.headers?.authorization;
            // if(!token) throw new NotFoundException("Token Not Found");
        } catch (error) {
            try {
                token = req.cookies?.access_token || req.cookies?.refresh_token;
            } catch (error) {
                throw new Error("Error Getting token!!")
            }
        }
        return token||null;
    }
}
