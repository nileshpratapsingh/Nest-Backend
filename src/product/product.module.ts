import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product, ProductSchema } from '@schemas/product.schema';
import { TokenUtility } from '@utils/token.utility';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ProductController],
  providers: [
        ProductService,
        TokenUtility,
        JwtService
    ],
    imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  exports: [MongooseModule],
})

export class ProductModule {}
