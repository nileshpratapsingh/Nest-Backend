import { IsEnum, IsNumber } from 'class-validator';
import { Currency } from '@enums/currency.enum';

export class CreatePaymentDto {
  @IsNumber()
  amount!: number;

  @IsEnum(Currency)
  currency!: Currency;
}
