import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from "mongoose";

export type messageDocument = Message & Document;

enum Role{
    SUPER_ADMIN = "super-admin",
    ADMIN = "admin",
    USER = "user",
}

enum Type{
    BUSINESS = "business",
    FEEDBACK = "feedback",
    COMPLAINT = "complaint",
}

@Schema({
    collection:'Messages',
    timestamps:true,
})
export class Message{

    @Prop({
        required:true,
        enum:Type,
        type:String,
        default:"garbage",
    })

    @Prop({required:true})
    name!:string;

    @Prop({
        required:true,
        enum:Role,
        default:Role.USER,
        type:String,
    })
    role!:Role

    @Prop({required:true})
    message!:string

    @Prop({required:true})
    phoneNumber!:string;

    @Prop({ required: true, default: Date.now.toLocaleString() })
    createdAt!: Date;

    @Prop({ required: true, default: Date.now.toLocaleString() })
    updatedAt!: Date;

}

export const MessageSchema = SchemaFactory.createForClass(Message);
