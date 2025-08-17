import { IsOptional, IsString, IsEmail, IsEnum, IsBoolean, IsNumber, Min, Max } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { ProjectStatus, UserRole } from '@prisma/client'

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

import {
    IsNotEmpty,
    IsArray,
    ArrayMinSize,
    IsString as IsStringEach,
    IsInt,
    IsDateString,
} from 'class-validator';

export class UpdateProjectDto {
    @ApiPropertyOptional({
        example: 'E-commerce platform',
        description: 'The title of the project',
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    title?: string;

    @ApiPropertyOptional({
        example: 'Build a full e-commerce platform using React and NestJS',
        description: 'A detailed description of the project requirements',
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description?: string;

    @ApiPropertyOptional({
        example: ['React', 'NestJS', 'PostgreSQL'],
        description: 'List of required technologies',
    })
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @IsStringEach({ each: true })
    technologies?: string[];

    @ApiPropertyOptional({
        example: 500,
        description: 'Project budget (in USD or chosen currency)',
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    budget?: number;

    @ApiPropertyOptional({
        example: '2025-09-01T00:00:00.000Z',
        description: 'Project deadline (in ISO 8601 format)',
    })
    @IsOptional()
    @IsDateString()
    deadline?: Date;
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @IsEnum(ProjectStatus)
    status?: ProjectStatus;
}
