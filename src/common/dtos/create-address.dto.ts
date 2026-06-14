import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createAddressDto {
  @IsString()
  @IsNotEmpty()
  street!: string;
  
  @IsString()
  @IsNotEmpty()
  state!: string;
  
  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsNumber()
  zipCode!: number;
}
