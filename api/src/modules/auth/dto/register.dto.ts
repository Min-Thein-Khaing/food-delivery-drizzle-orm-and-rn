

import { IsEmail, IsString, MaxLength, MinLength,IsEnum } from 'class-validator';


export enum UserRole{
    CUSTOMER = 'CUSTOMER',
    RESTAURANT_OWNER = 'RESTAURANT_OWNER',
    DRIVER = 'DRIVER',
}

export class RegisterDto {
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    firstName: string;

    @IsString()
    @MinLength(2)
    @MaxLength(100)
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsEnum(UserRole)
    role: UserRole ;
}
