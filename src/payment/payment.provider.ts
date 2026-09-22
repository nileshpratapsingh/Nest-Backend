import { ENV } from '@enums/environment-variable.enum';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';

export const PaymentProvider: Provider = {
  provide: 'RAZORPAY',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return new Razorpay({
      key_id: configService.get<string>(ENV.RAZORPAY_KEY_ID)!,
      key_secret: configService.get<string>(ENV.RAZORPAY_KEY_SECRET)!,
    });
  },
};
