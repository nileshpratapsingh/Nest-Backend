import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

class Review {
    @Prop()
    name!: string;

    @Prop()
    comment!: string;
}

class QA {
    @Prop()
    question!: string;

    @Prop()
    answer!: string;
}

@Schema({ timestamps: true })
export class Product {
    @Prop({
        required: true,
        unique: true,
    })
    id!: number;

    @Prop({
        required: true,
        trim: true,
    })
    title!: string;

    @Prop({
        type: [String],
        default: null,
    })
    category!: string[];

    @Prop({
        type: [String],
        default: null,
    })
    subCategory!: string[];

    @Prop({
        required: true,
        min: 0,
        max: 5,
    })
    rating!: number;

    @Prop({
        required: true,
        min: 0,
    })
    price!: number;

    @Prop({
        default: null,
    })
    productImage!: string;

    @Prop()
    description!: string;

    @Prop({
        type: [String],
        default: [],
    })
    features!: string[];

    @Prop({
        type: Map,
        of: String,
    })
    specs!: Record<string, string>;

    @Prop({
        default: null,
    })
    shipping!: string;

    @Prop({
        type: [Review],
        default: [],
    })
    reviews!: Review[];

    @Prop({
        default: false,
    })
    outOfStock!: boolean;

    @Prop({
        type: [QA],
        default: [],
    })
    qa!: QA[];

    @Prop({
        default: 0,
    })
    sale!: number;

    @Prop({
        default: 0,
    })
    quantity!: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Indexes
// ProductSchema.index({ title: 'text', description: 'text' });
// ProductSchema.index({ price: 1 });
