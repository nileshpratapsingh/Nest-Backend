import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    BadRequestException,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { Schema as MongooseSchema } from 'mongoose';
import { MessageDocument } from '@schemas/message.schema';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { UserOnly } from '@decorator/userOnly.decorator';

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Post("create")
    create(@Body() createMessageDto: CreateMessageDto):
    Promise<MessageDocument>{
        return this.messageService.createMessage(createMessageDto);
    }

    // @UserOnly()
    @Get("find-all")
    findAll():
    Promise<MessageDocument[]|string>{
        return this.messageService.findAll();
    }

    @UserOnly()
    @Get('find-message/:id')
    findOne(@Param('id') id: MongooseSchema.Types.ObjectId) {
        return this.messageService.findOne(id);
    }

    @UserOnly()
    @Patch('edit-message/:id')
    update(
        @Param('id') id: MongooseSchema.Types.ObjectId,
        @Body() updateMessageDto: UpdateMessageDto
    ) {
        return this.messageService.update(id, updateMessageDto);
    }

    @UserOnly()
    @Delete('delete-message/:id')
    remove(@Param('id') id: MongooseSchema.Types.ObjectId) {
        if(!this.messageService.remove(id))
            return `No message of id: ${id} to found!`;
        return this.messageService.remove(id);
    }

    @Patch('toggle-status/:id')
    toggleMessageStatus(
        @Param('id') id: MongooseSchema.Types.ObjectId,
        @Body() updateMessageDto:UpdateMessageDto
    ) {
        if (!updateMessageDto.messageStatus) {
            throw new BadRequestException('messageStatus is required');
        }

        return this.messageService.toggleMessageStatus(
            id,
            updateMessageDto.messageStatus,
        );
    }
}
