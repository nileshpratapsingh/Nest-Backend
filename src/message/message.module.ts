import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { User, UserSchema } from '@schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Message, MessageSchema } from '@schemas/message.schema';
import { Logger } from '@utils/logger.utility';
import { TokenUtility } from '@utils/token.utility';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema,
            },
            {
                name: Message.name,
                schema: MessageSchema,
            },
        ]),
        JwtModule.register({}),
    ],
    controllers: [MessageController],
    providers: [MessageService, Logger, TokenUtility],
})
export class MessageModule {}
