import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {
    _id?: string;

    @Prop({ required: true, minlength: 3, maxlength: 30 })
    name: string;

    @Prop({ required: true, minlength: 3, maxlength: 30 })
    lastname: string;

    @Prop({ required: true, minlength: 3, maxlength: 30 })
    username: string;
    
    @Prop({ unique: true, required: true })
    email: string;

    @Prop({ minlength: 8, required: true })
    password?: string;

    @Prop({ default: true })
    isActive: boolean;

}

export const UserSchema = SchemaFactory.createForClass( User );
