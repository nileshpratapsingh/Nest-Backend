import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { TokenUtility } from '@utils/token.utility';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from '@schemas/user.schema';
import { Login, LoginDocument } from '@schemas/login.schema';
import type { TokenPayload } from '@custom_types/tokenPayload.types';
import { CloudinaryUploadResult } from '@interfaces/cloudinaryUpload.interface';
import { ENV } from '@enums/environment-variable.enum';

@Injectable()
export class UserService {
  constructor(
    private readonly logger:Logger,
    private readonly tokenUtility: TokenUtility,
    private readonly configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Login.name) private loginModel: Model<LoginDocument>,
  ) {}

  async signUp(
    createUserDto: CreateUserDto,
    file?: CloudinaryUploadResult,
  ): Promise<{ message: string; user: User }> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const userData: any = {
        firstName: createUserDto.firstName.trim(),
        middleName: createUserDto.middleName?.trim(),
        lastName: createUserDto.lastName.trim(),
        email: createUserDto.email.toLowerCase(),
        password: hashedPassword,
        phoneNumber: createUserDto.phoneNumber,
        alternatePhone: createUserDto.alternatePhone,
        alternateEmail: createUserDto.alternateEmail?.toLowerCase(),
        dateOfBirth: createUserDto.dateOfBirth,
        gender: createUserDto.gender,
        address: createUserDto.address,
        role: createUserDto.role || 'user',
        deprecated: createUserDto.deprecated || false,
      };

      if (file) {
        userData.profileImage = file.secureUrl;
        userData.imagePublicId = file.publicId;
      }

      const newUser = await this.userModel.create(userData);

      return {
        message: 'User created successfully',
        user: newUser,
      };
    } catch (error: any) {
      this.logger.log('Check user service create method');
      this.logger.log(error?.name);
      this.logger.log(error?.stack);
      throw error;
    }
  }

  async login(
    res: Response,
    updateUserDto: UpdateUserDto,
  ): Promise<{
    user: LoginDocument;
    message: string;
    login: boolean;
    accessToken: string;
  } | null> {
    const { email, password } = updateUserDto;
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User Not Found!!');

    const tokenPayload: TokenPayload = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };

    if (password === user.password && email === user.email) {
      const accessToken = this.tokenUtility.generateAccessToken(tokenPayload);
      const refreshToken = this.tokenUtility.generateRefreshToken(tokenPayload);
      res.cookie('access_token', accessToken, {
        httpOnly: this.configService.get<boolean>(ENV.HTTP_ONLY),
        secure: this.configService.get<boolean>(ENV.SESSION_COOKIE_SECURE),
        sameSite: 'strict',
        maxAge: this.configService.get<number>(ENV.JWT_ACCESS_EXPIRES), // 10 mins
      });
      res.cookie('refresh_token', refreshToken, {
        httpOnly: this.configService.get<boolean>(ENV.HTTP_ONLY),
        secure: this.configService.get<boolean>(ENV.SESSION_COOKIE_SECURE),
        sameSite: 'strict',
        maxAge: this.configService.get<number>(ENV.JWT_REFRESH_EXPIRES), // 10 mins
      });
      const loginData = {
        refreshToken,
        userEmail: user.email,
        userPassword: user.password,
        userRole: user.role,
      };
      const newLogin = await this.loginModel.create(loginData);

      return {
        user: newLogin,
        message: 'user Logger IN.',
        login: true,
        accessToken,
      };
    }
    return null;
  }

  async logout(res: Response, req: Request): Promise<void> {
    const token = this.tokenUtility.getToken(req);

    if (!token) {
      throw new UnauthorizedException('Token is required');
    }

    const decode: TokenPayload|null = this.tokenUtility.decodeToken(token);
    if(!decode) throw new UnauthorizedException("Token not found!!");

    const login = this.loginModel.find({ userEmail: decode.email });
    if (!login)
      throw new UnauthorizedException('No user found to clear the cookie!!');

    res.clearCookie('refresh_token', {
      httpOnly: this.configService.get<boolean>(ENV.HTTP_ONLY),
      secure: this.configService.get<boolean>(ENV.NODE_ENV),
      sameSite: 'strict',
    });

    res.clearCookie('access_token', {
      httpOnly: this.configService.get<boolean>(ENV.HTTP_ONLY),
      secure: this.configService.get<boolean>(ENV.NODE_ENV),
      sameSite: 'strict',
    });

    const deleted = await this.loginModel.deleteOne({ accessToken: token });
    if (!deleted) {
      throw new InternalServerErrorException('Failed to delete resource');
    }
  }

  async findOne(req: Request): Promise<User> {
    const token = this.tokenUtility.getToken(req);
    if (!token) throw new UnauthorizedException('Token missing User Must Login!!');

    const decode: TokenPayload|null = this.tokenUtility.verifyToken(token);
    if(!decode) throw new UnauthorizedException("Token expired user must refresh their session.");

    const foundUser = await this.userModel.findById(decode.userId).exec();
    if (!foundUser) throw new NotFoundException('User not found.');

    return foundUser;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find();
    if (!users) throw new NotFoundException('User Not Found');
    return users;
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const updated = await this.userModel.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });

    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  async deleteUser(id: string) {
    const deleted = await this.userModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('User not found');
    return { message: 'Deleted successfully', deleted };
  }

  async refreshTokenToggle(req:Request, res:Response):
    Promise<LoginDocument|null>{

    const accessToken = this.tokenUtility.getAccessToken(req);
    if (!accessToken) throw new UnauthorizedException('Token missing User Must Login!!');

    let refreshToken:string|null;

    const decode = this.tokenUtility.decodeToken(accessToken);
    if(!decode) throw new UnauthorizedException("The session has expired Login again.");

    const refreshPayload:TokenPayload = {
        userId:decode.userId,
        email:decode.email,
        role:decode.role,
    }

    refreshToken = this.tokenUtility.generateRefreshToken(refreshPayload);
    const login = await this.loginModel.findOneAndUpdate(
            { userEmail : decode.email },
            { refreshToken },
            { new:true },
    )
    res.clearCookie('refreshToken', {
      httpOnly: this.configService.get<boolean>(ENV.HTTP_ONLY),
      secure: this.configService.get<boolean>(ENV.NODE_ENV),
      sameSite: 'strict',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: this.configService.get<boolean>(ENV.HTTP_ONLY),
      secure: this.configService.get<boolean>(ENV.SESSION_COOKIE_SECURE),
      sameSite: 'strict',
      maxAge: this.configService.get<number>(ENV.JWT_REFRESH_EXPIRES), // 10 mins
    });

    if(!refreshToken) return null;

    return login;
  }
}
