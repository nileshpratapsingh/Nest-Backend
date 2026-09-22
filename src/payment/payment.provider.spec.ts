import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import { PaymentProvider } from './payment.provider';

describe('PaymentProvider', () => {
  let razorpay: Razorpay;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentProvider,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              const config = {
                RAZORPAY_KEY_ID: 'rzp_test_key',
                RAZORPAY_KEY_SECRET: 'test_secret',
              };

              return config[key];
            },
          },
        },
      ],
    }).compile();

    razorpay = module.get<Razorpay>('RAZORPAY');
  });

  it('should create a Razorpay instance', () => {
    expect(razorpay).toBeDefined();
    expect(razorpay).toBeInstanceOf(Razorpay);
  });
});
