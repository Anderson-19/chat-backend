import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterUserDto {
    @IsString()
    name: string;

    @IsString()
    lastname: string;
    
    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @MinLength(8)
    password: string;
}