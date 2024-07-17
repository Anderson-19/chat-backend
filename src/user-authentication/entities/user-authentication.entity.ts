import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
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

    @Prop({ default: 'https://res.cloudinary.com/dav7kqayl/image/upload/v1703882215/social-network/default-users/wsbtqrhs3537j8v2ptlg.png' })
    avatar: string;

    @Prop({ default: '' })
    about: string;

    @Prop({ default: false })
    isActive: boolean;

}

export const UserSchema = SchemaFactory.createForClass( User );
