import { Model, Types } from 'mongoose';
import { Role } from '@enums/auth.enum';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { User, UserDocument } from '@schemas/user.schema';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
@Injectable()
export class AdminService {
    constructor(
        private readonly configService:ConfigService,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async create(userId: string, updateUserDto: UpdateUserDto) {
        try {
            const isUser = await this.userModel.findById(userId);
            if (!isUser) throw new UnauthorizedException("Unauthorized Entity. Register first.");

            const newRole = isUser.role === Role.USER ? Role.ADMIN : Role.USER;

            await this.userModel.findByIdAndUpdate(
                userId,
                { $set: { role: newRole } },
                { new: true }
            );
        } catch (error: any) {
            console.error('Error creating admin:', error.message);
            throw error;
        }
    }

    async findAll(): Promise<User[]> {
        try {
            return await this.userModel.find().exec();
        } catch (error:any) {
            console.error('Error retrieving admins:', error);
            console.error('Check findAll in admin.service.ts');
            console.error('Error details:', error.message);
            return [];
        }
    }

    async findOne(id: string) {
        try {
            if (!Types.ObjectId.isValid(id)) {
                console.log(Types.ObjectId.isValid(id));
                throw new NotFoundException('Invalid admin id');
            }

            const user = await this.userModel.findById(id).exec();

            if (!user) {
                throw new NotFoundException(`Admin with id ${id} not found`);
            }

            if (!user.deprecated) {
                throw new ForbiddenException(`Admin with id ${id} is deprecated`);
            }

            return user;
        } catch (error:any) {
            console.error('Error retrieving admin:', error.name);
            console.error('Check findOne in admin.service.ts');
            console.error('Error details:', error.message);
            throw error;
        }
    }

    async update(
        id: string,
        updateAdminDto: UpdateAdminDto,
    ): Promise<User | null> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Invalid admin id');
        }
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`Admin with id ${id} not found`);
        }
        if (!user.deprecated) {
            throw new ForbiddenException(`Admin with id ${id} is deprecated`);
        }
        return this.userModel
            .findByIdAndUpdate(id, updateAdminDto, { new: true })
            .exec();
    }

    async remove(id: string): Promise<{ deleted: boolean }> {
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException('Invalid admin id');
        }
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`Admin with id ${id} not found`);
        }
        if (!user.deprecated) {
            throw new ForbiddenException(`Admin with id ${id} is deprecated`);
        }
        await this.userModel.findByIdAndDelete(id);
        return { deleted: true };
    }

    async addButton(id: string) {
        try {
            const user = await this.userModel.findById(id).exec();

            if (!user) {
                throw new Error("Admin not found");
            }

            const newRole = user.role === Role.USER ? Role.ADMIN : Role.USER;

            await this.userModel.updateOne(
                { _id: id },
                { $set: { role: newRole } }
            );

            return { message: "Role updated successfully", role: newRole };
        } catch (error:any) {
            console.log(error);
            console.log("Check addButton admin service");
            throw error;
        }
    }

}
