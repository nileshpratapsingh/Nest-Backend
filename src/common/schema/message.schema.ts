import { UserStatusEnum } from '@enums/user-status.enum';
import { MessageTypeEnums } from '@enums/message-types.enum';
import { Document, Schema as MongooseSchema } from "mongoose";
import { MessageStatusEnum } from '@enums/message-status.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type MessageDocument = Message & Document;

@Schema({
  collection: 'Messages',
  timestamps: true,
})
export class Message {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId!: string;

  @Prop({ required: true })
  senderName!: string;

  @Prop({ required: true })
  senderEmail!: string;

  @Prop({ required: true })
  senderPhoneNumber!: number;

  @Prop({ required: true })
  message!: string;

  @Prop({
    required: true,
    enum: MessageTypeEnums,
    type: String,
  })
  messageType!: MessageTypeEnums;

  @Prop({
    required: true,
    enum: MessageStatusEnum,
    type: String,
  })
  messageStatus!: MessageStatusEnum;

  @Prop({
    required: true,
    enum: UserStatusEnum,
    default: UserStatusEnum.USER,
    type: String,
  })
  userStatus!: UserStatusEnum;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
