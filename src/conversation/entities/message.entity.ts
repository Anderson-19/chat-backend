import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "src/user-authentication/entities/user-authentication.entity";

@Schema({ timestamps: true })
export class Message {

    _id?: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    senderId: User;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    receiverId: User;

    @Prop({ required: true, type: String })
    message: string;

    @Prop({ default: '' })
    image: string;

}

export const MessageSchema = SchemaFactory.createForClass( Message );
