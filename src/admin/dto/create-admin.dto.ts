import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsDateString,
  IsBoolean,
  MinLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { createAddressDto } from '../../common/dtos/create-address.dto';

export class CreateAdminDto {
  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @Matches(/^[0-9]{10}$/)
  phoneNumber!: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10}$/)
  alternatePhoneNumber?: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @Type(() => createAddressDto)
  address?: createAddressDto;

  @IsDateString()
  dateOfBirth!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsEmail()
  alternateEmail?: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password!: string;
}
