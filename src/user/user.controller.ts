import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Res, Req } from '@nestjs/common';
import { UserService } from './user.service';
import type { Request, Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserOnly } from '@decorator/userOnly.decorator';
import { AdminOnly } from '@decorator/adminOnly.decorator';
import { AddressParserPipe } from '@pipes/address-parser/address-parser.pipe';
import { CloudinaryUploadResult } from '@interfaces/cloudinaryUpload.interface';
import { LoginRestrictionGuard } from '@guards/login-restriction/login-restriction.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(LoginRestrictionGuard)
  @Post('signUp')
  signUpProcedure(
    @Body(AddressParserPipe)
    createUserDto: CreateUserDto,

    @Req()
    req: Request,
  ) {
    const file = (req as any).file as CloudinaryUploadResult;
    return this.userService.signUp(createUserDto, file);
  }

  @UseGuards(LoginRestrictionGuard)
  @Post('login')
  loginProcedure(@Res() res: Response, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.login(res, updateUserDto);
  }

  @AdminOnly()
  @Get('all')
  findAllUsers() {
    return this.userService.findAll();
  }

  @UserOnly()
  @Get(':id')
  findOne(@Req() req: Request) {
    return this.userService.findOne(req);
  }
  
  @UserOnly()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @UserOnly()
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @UserOnly()
  @Post()
  refreshTokenToggle(@Res() res:Response, @Req() req:Request){
    return this.userService.refreshTokenToggle(req, res)
  }
}
