import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema({
    collection: 'admins',
    timestamps: true,
})
export class Admin {
    @Prop({ default: null })
    profileImage?: string;

    @Prop({ default: 'admin' })
    role?: string;

    @Prop({ required: true })
    firstName!: string;

    @Prop({ required: false })
    middleName?: string;

    @Prop({ required: true })
    lastName!: string;

    @Prop({ required: true })
    phoneNumber!: string;
    @Prop({ required: false })
    alternatePhoneNumber?: string;

    @Prop({ default: false })
    status?: boolean;

    @Prop({
        type: {
            street: { type: String, required: true },
            state:  { type: String, required: true },
            city:   { type: String, required: true },
            pincode: { type: String, required: true },
        },
        required: false,
        default: undefined,
    })

    address?: {
        street: string;
        state: string;
        city: string;
        pincode: string;
    };

    @Prop({ required: true })
    dateOfBirth!: Date;

    @Prop({ required: true, unique: true })
    email!: string;

    @Prop({ required: false })
    alternateEmail?: string;

    @Prop({ required: true })
    password!: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
