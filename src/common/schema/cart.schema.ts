import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema({ _id: false })

export class CartItem {
    @Prop({
        type: String,
        ref: 'Product',
        required: true,
    })
    productId!: string;

    @Prop({
        type: Number,
        default: 1,
        min: 1,
    })
    quantity!: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

// ── Main Cart Schema ───────────────────────────────────────────
@Schema({ collection: 'carts' })
export class Cart {
    @Prop({
        type: Types.ObjectId,
        ref: 'Signup',
        required: true,
    })
    userId!: Types.ObjectId;

    @Prop({
        type: [CartItemSchema],
        default: [],
    })
    items!: CartItem[];

    @Prop({
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 30,
    })
    updatedAt!: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
