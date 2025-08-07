import { IsOptional, IsString, IsEmail, IsEnum, IsBoolean, IsNumber, Min, Max } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'

export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'Ali Valiyev', description: 'Foydalanuvchining to‘liq ismi' })
    @IsOptional()
    @IsString()
    full_name?: string

    @ApiPropertyOptional({ example: 'ali@gmail.com', description: 'Foydalanuvchi email manzili' })
    @IsOptional()
    @IsEmail()
    email?: string


    @ApiPropertyOptional({ example: 'Frontend dasturchi', description: 'Foydalanuvchi haqida qisqacha bio' })
    @IsOptional()
    @IsString()
    bio?: string

}
