import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LoginDocument = Login & Document;

@Schema({
  _id: false,
  versionKey: false,
  timestamps: true,
})
export class Login {
  @Prop({ required: true, type: String })
  accessToken!: string;

  @Prop({ required: true, lowercase: true, type: String })
  userEmail!: string;

  @Prop({ required: true, type: String })
  userPassword!: string;

  @Prop({ required: true, type: String })
  userRole!: string;
}

export const LoginSchema = SchemaFactory.createForClass(Login);
