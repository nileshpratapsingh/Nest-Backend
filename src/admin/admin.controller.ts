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
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiGuard } from '@guards/api-guard/api-guard.guard';
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @UseGuards(ApiGuard)
    @Get()
    findAll() {
        return this.adminService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        console.log("id type", typeof (id));
        return this.adminService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateAdminDto: UpdateAdminDto
    ) {
        return this.adminService.update(id, updateAdminDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.adminService.remove(id);
    }
    @Patch('toggle/:id')
    addButton(
        @Param(':id')
        id: string
    ) {
        return this.adminService.addButton(id)
    }
}
