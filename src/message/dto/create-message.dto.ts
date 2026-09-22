import { Type } from "class-transformer";
import { UserStatusEnum } from "@enums/user-status.enum";
import { MessageTypeEnums } from "@enums/message-types.enum";
import { MessageStatusEnum } from "@enums/message-status.enum";
import { 
  IsString, 
  IsNumber, 
  IsNotEmpty, 
  IsEnum, 
  IsDate, 
  IsMongoId, 
  IsOptional, 
  IsEmail 
} from "class-validator";

export class CreateMessageDto {
  @IsMongoId()
  userId!: string;

  @IsNotEmpty()
  @IsString()
  senderName!: string;

  @IsEmail()
  senderEmail!: string;

  @IsNumber()
  senderPhoneNumber!: number;

  @IsNotEmpty()
  @IsString()
  message!: string;

  @IsEnum(MessageTypeEnums)
  messageType!: MessageTypeEnums;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdAt?: Date;

  @IsEnum(MessageStatusEnum)
  messageStatus!: MessageStatusEnum;

  @IsEnum(UserStatusEnum)
  userStatus!: UserStatusEnum;
}
