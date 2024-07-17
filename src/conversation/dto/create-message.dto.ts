import { IsMongoId, IsString } from "class-validator";
import mongoose from "mongoose";

export class CreateMessageDto {

    @IsMongoId()
    senderId: mongoose.Schema.Types.ObjectId;

    @IsMongoId()
    receiverId: mongoose.Schema.Types.ObjectId;

    @IsString()
    message: string;
}
