import Razorpay from 'razorpay';
import { v4 as uuidV4 } from "uuid";
import { ConfigService } from '@nestjs/config';
import { Currency } from '@enums/currency.enum';
import { createHmac } from 'crypto';
import { Injectable, Inject } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import type { CreatePaymentType, VerifyPaymentType } from '@custom_types/payment.types';
import { ENV } from '@enums/environment-variable.enum';

@Injectable()
export class PaymentService {
    constructor(
        private readonly configService:ConfigService,
        @Inject('RAZORPAY') private readonly razorpay: Razorpay,
    ){}

    async createPayment(createPaymentDto: CreatePaymentDto):Promise<CreatePaymentType> {

        const id = uuidV4();
        const razorpayPayment = await this.razorpay.orders.create({
            amount: Number(createPaymentDto.amount) * 100,
            currency: createPaymentDto.currency || "INR",
            receipt: `receipt_${id.slice(0, 20)}`,
        });
        return {
            success: true,
            key: process.env.RAZORPAY_KEY_ID,
            orderId: razorpayPayment.id,
            amount: Number(razorpayPayment.amount),
            currency: razorpayPayment.currency as Currency
        };
    }


    async verifyPayment(verifyPaymentDto:VerifyPaymentDto):Promise<VerifyPaymentType>{
        const body = verifyPaymentDto.razorpay_order_id + "|" + verifyPaymentDto.razorpay_payment_id;

        const expectedSignature = createHmac("sha256", this.configService.getOrThrow<string>(ENV.RAZORPAY_KEY_SECRET))
        .update(body)
        .digest("hex");

        if (expectedSignature !== verifyPaymentDto.razorpay_signature) {
            return {
                success: false,
                message: "Payment Signature verification failed",
            };
        }

        return{
            message: "Payment Signature verified",
            success: true,
        };
    }
}
