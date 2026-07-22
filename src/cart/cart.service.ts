import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from "@schemas/cart.schema"
import { User, UserDocument } from "@schemas/user.schema"
import { Model , Types } from 'mongoose';
import { Product, ProductDocument } from '@schemas/product.schema';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    ) {}

    async saveCart(createCartDto: CreateCartDto) {
        const { userId, productIds } = createCartDto;

        const userExists = await this.userModel.findById(userId);
        if (!userExists) throw new NotFoundException('User Not Found!!!');

        const existingCart = await this.cartModel.findOne({ userId });

        if (existingCart) {
            for (const item of productIds) {
                const existingItem = existingCart.items.find(
                    (i) => i.productId.toString() === item.productId.toString(),
                );

                if (existingItem) {
                    existingItem.quantity += item.quantity ?? 1;
                } else {
                    existingCart.items.push({
                        productId: item.productId.toString(),
                        quantity: item.quantity ?? 1,
                    });
                }
            }

            existingCart.updatedAt = new Date();
            return await existingCart.save();

        } else {
            const newCart = new this.cartModel({
                userId: new Types.ObjectId(userId.toString()),
                items: productIds.map((item) => ({
                    productId: new Types.ObjectId(item.productId),
                    quantity: item.quantity ?? 1,
                })),
            });

            return await newCart.save();
        }
    }

    async getCart(updateCartDto:UpdateCartDto){
        const { userId } = updateCartDto;
        if(!userId) return null;
        const cart = await this.cartModel.findById({userId});
        if(!cart) return "your cart is empty";

        const prices = await Promise.all(
            cart.items.map(async (item) => {
                const product = await this.productModel.findById(item.productId);
                if (!product) return 0;
                return product.price * item.quantity;
            }),
        );

        const totalPrice: number = prices.reduce((acc, subtotal) => acc + subtotal, 0);
        return {
            cart:cart,
            totalPrice:totalPrice,
        }
    }

    async removeItem(
        productId: string,
        updateCartDto: UpdateCartDto,
    ) {
        const { userId } = updateCartDto;
        const cart = await this.cartModel.findOne({ userId });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        cart.items = cart.items.filter(
            (item) => item.productId.toString() !== productId,
        );

        cart.updatedAt = new Date();
        await cart.save();
        return cart;
    }

    async alterQuantity(productId: string, newQuantity: number, updateCartDto: UpdateCartDto) {
        const { userId } = updateCartDto;

        const existingCart = await this.cartModel.findOne({ userId });
        if (!existingCart) throw new NotFoundException('Cart not found');

        const found = existingCart.items.find(
            (i) => i.productId === productId
        );

        if (!found) throw new NotFoundException('Product not found in cart');

        found.quantity = newQuantity;

        existingCart.updatedAt = new Date();
        return await existingCart.save();
    }
}
