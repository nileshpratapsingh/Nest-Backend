import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';
import { TokenUtility } from '@utils/token.utility';
import { User,UserSchema } from '@schemas/user.schema';
import { Logger, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CloudinaryUploadMiddleware } from '@middlewares/image-upload/image-upload.middleware';
import { Login, LoginSchema } from '@schemas/login.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema
            },
            {
                name: Login.name,
                schema: LoginSchema
            },
        ]),
        JwtModule.register({}),
    ],
    controllers: [UserController],
    providers: [
        CloudinaryUploadMiddleware,
        UserService,
        TokenUtility,
        Logger
    ],
    exports:[TokenUtility, Logger]
})
export class UserModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {

        consumer
            .apply(CloudinaryUploadMiddleware)
            .forRoutes(
                {
                    path: 'user/signUp',
                    method: RequestMethod.POST,
                },
            );
    }
}
