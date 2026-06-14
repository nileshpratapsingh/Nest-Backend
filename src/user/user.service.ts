import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { type Request, type Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from '@schemas/user.schema';
import { type TokenPayload, TokenUtility } from '@utils/token.utility';
import { CloudinaryUploadResult } from '@middlewares/image-upload/image-upload.middleware';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class UserService {
    constructor(
        private readonly tokenUtility: TokenUtility,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
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
            console.log('Check userservice create method');
            console.log(error?.name);
            console.log(error?.stack);
            throw error;
        }
    }

    async login(res: Response, updateUserDto: UpdateUserDto): Promise<void> {
        const { email, password } = updateUserDto;
        const user = await this.userModel.findOne({ email });
        if (!user) throw new NotFoundException('User Not Found!!');

        const tokenPayload: TokenPayload = {
            userId: user._id,
            email: user.email,
            role: user.role,
        };

        if (password === user.password && email === user.email) {
            const accessToken = this.tokenUtility.genrateAccessToken(tokenPayload);
            res.cookie('access_token', accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 10 * 60 * 1000, // 10mins
            });
        }
    }

    async logout(): Promise<void> {}

    async findOne(req: Request): Promise<User> {
        const token = this.tokenUtility.getToken(req);
        if (!token) throw new UnauthorizedException('User Must Login!!');
        const decode = this.tokenUtility.verifyToken(token);

        const foundUser = await this.userModel.findById(decode.userId).exec();
        if (!foundUser) throw new NotFoundException('User not found');

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
}
