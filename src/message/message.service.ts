import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Logger } from '@utils/logger.utility';
import { NotFoundException } from '@nestjs/common';
import { User, UserDocument } from '@schemas/user.schema';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageStatusEnum } from '@enums/message-status.enum';
import { Message, MessageDocument } from '@schemas/message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(User.name)
    private readonly UserModel: Model<UserDocument>,
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    private readonly logger:Logger,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto): Promise<MessageDocument> {
    const user = await this.UserModel.findById(createMessageDto.userId);
    if (!user) {
      throw new NotFoundException(
        `User with ID ${createMessageDto.userId} not found`,
      );
    }
    this.logger.configValueLogger("JWT_ACCESS_SECRET");

    return await this.messageModel.create(createMessageDto);
  }

  async findAll(): Promise<MessageDocument[] | string> {
    const all: MessageDocument[] = await this.messageModel.find({}).exec();
  
    if (!all || all.length === 0) {
      return "No message to be found";
    }
  
    return all;
  }

  async findOne(id: MongooseSchema.Types.ObjectId):
  Promise<MessageDocument | null>{
    const message = this.messageModel.findById(id);

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return await this.messageModel.findById(id);
  }

  async update(id: MongooseSchema.Types.ObjectId, updateMessageDto: UpdateMessageDto):
  Promise<MessageDocument | string | null> {
    const message = await this.messageModel.findById(id);
    if(!message) return `There is no message with the id: ${id} to edit!!`
    if(message.messageStatus === MessageStatusEnum.NOTSEEN){
        return await this.messageModel.findByIdAndUpdate(
            id,
            { message : updateMessageDto.message },
            { new : true },
        )
    }
    return `Message can't be edited because message has been read.`;
  }

  async remove(id: MongooseSchema.Types.ObjectId):
  Promise<Boolean | null>{
    const message = this.messageModel.findById(id);

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return await this.messageModel.findByIdAndDelete(id);
  }

  async toggleMessageStatus(id:MongooseSchema.Types.ObjectId, status:MessageStatusEnum):
  Promise<MessageDocument | null>{
    const newMessage = await this.messageModel.findById(id);

    if (!newMessage) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    newMessage?.messageStatus === MessageStatusEnum.NOTSEEN ? (status) : MessageStatusEnum.NOTSEEN;

    return await this.messageModel.findByIdAndUpdate(
       id,
       { messageStatus: status },
       { new: true }
    );
  }
}
