import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateAdminDto {
    @IsString()
    @IsNotEmpty()
    full_name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsString()
    bio?: string;

    role: UserRole = UserRole.ADMIN;
}
