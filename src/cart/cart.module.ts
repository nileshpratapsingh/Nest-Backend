import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart, CartSchema } from '@schemas/cart.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@schemas/user.schema';
import { Product, ProductSchema } from '@schemas/product.schema';
@Module({
  imports: [
        MongooseModule.forFeature([
            { name: Cart.name, schema: CartSchema },
            { name: User.name, schema: UserSchema },
            { name: Product.name, schema: ProductSchema },
        ]),
    ],  controllers: [CartController],
  providers: [CartService],
})
export class CartModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer
        .apply()
    }
}
