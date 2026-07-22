import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart, CartSchema } from '@schemas/cart.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@schemas/user.schema';
import { Product, ProductSchema } from '@schemas/product.schema';
import { UserModule } from 'src/user/user.module';
@Module({
  imports: [
        MongooseModule.forFeature([
            { name: Cart.name, schema: CartSchema },
            { name: User.name, schema: UserSchema },
            { name: Product.name, schema: ProductSchema },
        ]),
        UserModule
    ],  controllers: [CartController],
  providers: [CartService],
})
export class CartModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply()
    }
}
