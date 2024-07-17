import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from 'mongoose';
import { User } from "src/user-authentication/entities/user-authentication.entity";
import { Message } from "./message.entity";

@Schema({ timestamps: true })
export class Conversation {

    _id?: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    participants: User[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] })
    messages: Message[];

}

export const ConversationSchema = SchemaFactory.createForClass( Conversation );
