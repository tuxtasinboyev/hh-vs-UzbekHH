import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
    IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class RegisterAuthDto {
    @ApiProperty({
        example: 'Ali Valiyev',
        description: 'Foydalanuvchining to‘liq ismi',
    })
    @IsNotEmpty({ message: 'To‘liq ism majburiy' })
    @IsString()
    fullName: string;

    @ApiProperty({
        example: 'ali@gmail.com',
        description: 'Foydalanuvchining elektron pochtasi',
    })
    @IsNotEmpty({ message: 'Email majburiy' })
    @IsEmail({}, { message: 'Notog‘ri email format' })
    email: string;

    @ApiProperty({
        example: 'strongPassword123',
        description: 'Foydalanuvchining paroli (kamida 6 ta belgi)',
    })
    @IsNotEmpty({ message: 'Parol majburiy' })
    @Length(6, 32, { message: 'Parol 6 dan 32 belgigacha bo‘lishi kerak' })
    password: string;

    @ApiProperty({
        example: '123456',
        description: 'Elektron pochtaga yuborilgan 6 xonali tasdiqlash kodi',
    })
    @IsString()
    otp: string;

    @ApiProperty({
        example: 'DEVELOPER',
        description: 'Foydalanuvchining roli: DEVELOPER yoki CUSTOMER',
        enum: UserRole,
    })
    @IsEnum(UserRole, { message: 'Role noto‘g‘ri: DEVELOPER yoki CUSTOMER bo‘lishi kerak' })
    role: UserRole;
}
