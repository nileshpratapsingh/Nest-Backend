import { Schema as MongooseSchema } from "mongoose";
import { IsDate, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { PaymentTypesEnum } from "@enums/payment-types.enum";
import { Currency } from "@enums/currency.enum";

export class CreateOrderDto {

    @IsMongoId()
    @IsOptional()
    cartId!: MongooseSchema.Types.ObjectId;

    @IsMongoId()
    @IsOptional()
    productId!: MongooseSchema.Types.ObjectId;

    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    cartPrice!:number;

    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    productPrice!:number;

    @IsEnum(PaymentTypesEnum)
    paymentType!:PaymentTypesEnum;

    @IsEnum(Currency)
    currencyType!:Currency;

    @IsNotEmpty()
    @IsString()
    emailAddress!:string;

    @IsDate()
    deliveryDate!:Date;

    @IsString()
    @IsOptional()
    notes!:string;

    @IsNotEmpty()
    @IsNumber()
    tax!:number;

    @IsNotEmpty()
    @IsString()
    razorpay_order_id!:string;

    @IsNotEmpty()
    @IsString()
    razorpay_payment_id!:string;
}
