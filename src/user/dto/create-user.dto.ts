import {
  IsString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsPhoneNumber,
  MinLength,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Gender, Role } from '@enums/auth.enum';

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  street!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  state!: string;

  @IsString()
  @IsNotEmpty()
  zip!: string;
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsOptional()
  profileImage?: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('IN')
  phoneNumber!: string;

  @IsString()
  @IsOptional()
  @IsPhoneNumber('IN')
  alternatePhone?: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsEmail()
  @IsOptional()
  alternateEmail?: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth!: string;

  @IsEnum(Gender, { message: 'gender must be Male, Female or Others' })
  gender!: Gender;

  @ValidateNested()
  @Type(() => AddressDto)
  address!: AddressDto;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password!: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsBoolean()
  @IsOptional()
  deprecated?: boolean;
}
