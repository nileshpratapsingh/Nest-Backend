import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Gender, Role } from '@enums/auth.enum';
export type UserDocument = User & Document;

@Schema({ _id: false })
export class Address {
  @Prop({ required: true, trim: true, type: String })
  street!: string;

  @Prop({ required: true, trim: true, type: String })
  city!: string;

  @Prop({ required: true, trim: true, type: String })
  state!: string;

  @Prop({ required: true, trim: true, type: String })
  zip!: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

@Schema({ versionKey: false })
export class User {
  @Prop({ required: true, trim: true, type: String })
  firstName!: string;

  @Prop({ trim: true, type: String, default: null })
  middleName!: string;

  @Prop({ required: true, trim: true, type: String })
  lastName!: string;

  @Prop({ type: String, default: null })
  profileImage!: string;

  @Prop({ required: true, trim: true, type: String })
  phoneNumber!: string;

  @Prop({ trim: true, type: String })
  alternatePhone!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, type: String })
  email!: string;

  @Prop({ lowercase: true, trim: true, type: String })
  alternateEmail!: string;

  @Prop({ required: true, type: Date })
  dateOfBirth!: Date;

  @Prop({ required: true, type: String, enum: Gender })
  gender!: Gender;

  @Prop({ type: AddressSchema, required: true })
  address!: Address;

  @Prop({ required: true, type: String, select: false })
  password!: string;

  @Prop({ type: String, enum: Role, default: Role.USER })
  role!: Role;

  @Prop({ type: Boolean, default: false })
  deprecated!: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
