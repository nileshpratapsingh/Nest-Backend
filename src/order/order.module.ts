import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema
            },
        ]),
        JwtModule.register({}),
    ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
