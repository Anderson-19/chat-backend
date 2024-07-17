import { IsMongoId } from "class-validator";
import mongoose from "mongoose";

export class CreateConversationDto {

    @IsMongoId()
    participants: mongoose.Schema.Types.ObjectId[];

    @IsMongoId()
    messages: mongoose.Schema.Types.ObjectId[];
}
