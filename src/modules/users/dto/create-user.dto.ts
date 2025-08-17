import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class CreateAdminDto {
    @ApiProperty({ description: 'Full name of the admin', example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    full_name: string;

    @ApiProperty({ description: 'Admin email address', example: 'john.doe@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Admin password', example: 'password123', minLength: 6 })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ description: 'Short bio of the admin', example: 'Web developer with 10 years of experience', required: false })
    @IsOptional()
    @IsString()
    bio?: string;

    @ApiProperty({ description: 'Role of the user', example: 'ADMIN', default: 'ADMIN' })
    role: UserRole = UserRole.ADMIN;
}

export class UpdateProfileDto {

    @ApiProperty({
        description: 'Skills of the user',
        example: ['JavaScript', 'NestJS', 'React'],
        required: false,
        type: [String],
    })
    @IsOptional()
    @IsArray()
    skills?: string[];

    @ApiProperty({
        description: 'GitHub URL of the user',
        example: 'https://github.com/johndoe',
        required: false,
    })
    @IsOptional()
    @IsUrl()
    github_url?: string;

    @ApiProperty({
        description: 'LinkedIn URL of the user',
        example: 'https://linkedin.com/in/johndoe',
        required: false,
    })
    @IsOptional()
    @IsUrl()
    linkedin_url?: string;

    @ApiProperty({
        description: 'Portfolio URL of the user',
        example: 'https://johndoe.com',
        required: false,
    })
    @IsOptional()
    @IsUrl()
    portfolio_url?: string;

    @ApiProperty({
        description: 'Experience of the user',
        example: '5 years of experience in software development',
        required: false,
    })
    @IsOptional()
    @IsString()
    experience?: string;
}


import {
    ArrayMinSize,
    IsInt,
    Min,
    IsDateString,
} from 'class-validator';
import { ProjectStatus } from '@prisma/client'; 

export class CreateProjectDto {
    @ApiProperty({
        example: 'E-commerce platform',
        description: 'The title of the project',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        example: 'Build a full e-commerce platform using React and NestJS',
        description: 'A detailed description of the project requirements',
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        example: ['React', 'NestJS', 'PostgreSQL'],
        description: 'List of required technologies',
    })
    @IsArray()
    @ArrayMinSize(1)
    @IsString({ each: true })
    technologies: string[];

    @ApiProperty({
        example: 500,
        description: 'Project budget (in USD or chosen currency)',
    })
    @IsInt()
    @Min(1)
    budget: number;

    @ApiProperty({
        example: '2025-09-01T00:00:00.000Z',
        description: 'Project deadline (in ISO 8601 format)',
    })
    @IsDateString()
    deadline: Date;
}
