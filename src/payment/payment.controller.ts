import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { UserOnly } from '@decorator/userOnly.decorator';

@UserOnly()
@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post('create_payment')
    create(@Body() createPaymentDto: CreatePaymentDto) {
        return this.paymentService.createPayment(createPaymentDto);
    }

    @Post('verify_payment')
    verifyPayment(
        @Body() verifyPaymentDto:VerifyPaymentDto
    ) {
        return this.paymentService.verifyPayment(verifyPaymentDto);
    }

}
