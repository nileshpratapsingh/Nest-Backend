import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Res, Req } from '@nestjs/common';
import { type Request, type Response } from "express";
import { Roles } from '@decorator/roles.decorator';
import { Role } from '@enums/auth.enum';
import { AdminProtectedGuard } from '@guards/admin-protected/admin-protected.guard';
import { LoginProtectedGuard } from '@guards/login-protected/login-protected.guard';
import { CloudinaryUploadResult } from '@middlewares/image-upload/image-upload.middleware';
import { AddressParserPipe } from '@pipes/address-parser/address-parser.pipe';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('signUp')
    signUpProcedure(
        @Body(AddressParserPipe) createUserDto: CreateUserDto,
        @Req() req: Request
    ) {
        // console.log("req.body =", req.body);
        // console.log("dto =", createUserDto);
        // console.log("file =", (req as any).cloudinaryFile as CloudinaryUploadResult);
        const file = (req as any).cloudinaryFile as CloudinaryUploadResult;
        return this.userService.signUp(createUserDto, file);
    }

    @Post('login')
    loginProcedure(
        @Res() res :Response,
        @Body() updateUserDto: UpdateUserDto
    ){
        return this.userService.login(res,updateUserDto)
    }

    @Get('all')
    @UseGuards(AdminProtectedGuard)
    @Roles(Role.ADMIN,Role.SUPER_ADMIN)
    findAllUsers(){
        return this.userService.findAll();
    }

    @Get(':id')
    @UseGuards(LoginProtectedGuard)
    @Roles(Role.USER)
    findOne(
        @Req() req :Request
    ){
        return this.userService.findOne(req);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto
    ){
        return this.userService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    deleteUser(@Param('id') id: string) {
        return this.userService.deleteUser(id);
    }
}
