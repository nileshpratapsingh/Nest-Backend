import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentProvider } from './payment.provider';
import { TokenUtility } from '@utils/token.utility';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [JwtModule.register({})],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentProvider, TokenUtility],
})
export class PaymentModule {}
