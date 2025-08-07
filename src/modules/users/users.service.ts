import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/core/config/prisma/prisma.service';
import * as bcrypt from "bcrypt"

@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService) { }
    async getMe(userId: string) {
        const existsUser = await this.prismaService.user.findUnique({ where: { id: userId }, include: { OAuthAccount: true, blog_posts: true, profile: true, projects: true } })
        if (!existsUser) throw new NotFoundException('user not found!')
        const { password, ...safeUser } = existsUser
        return {
            success: true,
            data: safeUser
        }
    }
    async updateAccountMe(payload: UpdateUserDto, userId: string) {
        const existsExmail = await this.prismaService.user.findUnique({ where: { email: payload.email } })
        if (existsExmail) throw new ConflictException('this email already exists')

        const existingUser = await this.prismaService.user.findUnique({ where: { id: userId } })
        if (!existingUser) throw new NotFoundException('user not found')
        const reviews = await this.prismaService.review.findMany({
            where: {
                developerId: userId,
            },
            select: {
                rating: true,
            },
        })

        const total = reviews.length
        const sum = reviews.reduce((acc, cur) => acc + cur.rating, 0)
        const average = total > 0 ? sum / total : 0

        const updated = await this.prismaService.user.update({ where: { id: userId }, data: { bio: payload.bio, email: payload.email, full_name: payload.full_name, rating: average } })
        const { password, ...safeUser } = updated
        return {
            success: true,
            data: safeUser
        }
    }
    async resetPassword(oldPassword: string, newPassword: string, userId: string) {
        const existingUser = await this.prismaService.user.findUnique({ where: { id: userId } })
        if (!existingUser) throw new NotFoundException('user not found!')
        const isMatch = await bcrypt.compare(oldPassword, existingUser.password!);
        if (!isMatch) throw new ConflictException('password invalid');

        const isMatchs = await bcrypt.compare(newPassword, existingUser.password!);
        if (!isMatchs) throw new ConflictException('this password already exists');

        await this.prismaService.user.update({ where: { id: userId }, data: { password: newPassword } })

        return {
            success: true,
            message: "user password updated"
        }
    }
    async findAllUsers(query: {
        search?: string;
        role?: string;
        id?: string;
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }) {
        const {
            search,
            role,
            id,
            page = 1,
            limit = 10,
            sortBy = 'created_at',
            sortOrder = 'desc',
        } = query;

        const safePage = Math.max(1, Number(page));
        const safeLimit = Math.max(1, Number(limit));

        const allowedSortFields = ['created_at', 'updated_at', 'full_name', 'email', 'rating'];
        const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
        const safeSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

        const where: any = {};

        if (id && typeof id === 'string') {
            where.id = id;
        }

        if (role && ['ADMIN', 'CUSTOMER', 'DEVELOPER'].includes(role)) {
            where.role = role;
        }

        if (search && typeof search === 'string') {
            where.OR = [
                { full_name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [users, total] = await this.prismaService.$transaction([
            this.prismaService.user.findMany({
                where,
                skip: (safePage - 1) * safeLimit,
                take: safeLimit,
                orderBy: {
                    [safeSortBy]: safeSortOrder,
                },
            }),

            this.prismaService.user.count({ where }),
        ]);

        return {
            total,
            page: safePage,
            limit: safeLimit,
            totalPages: Math.ceil(total / safeLimit),
            users,
        };
    }
    async deleteUser(id: string) {
        const existsUser = await this.prismaService.user.findUnique({ where: { id } })
        if (!existsUser) throw new NotFoundException('user not found')
        await this.prismaService.user.delete({ where: { id } })

        return {
            success: true,
            message: 'successfully deleted'
        }
    }
    async createAdmin(payload: CreateAdminDto) {
        const existsUser = await this.prismaService.user.findUnique({ where: { email: payload.email } })
        if (existsUser) throw new ConflictException('admin already exists')
        const hashedPassword = await bcrypt.hash(payload.password, 10)
        const createAdmin = await this.prismaService.user.create({
            data: {
                email: payload.email,
                full_name: payload.full_name,
                bio: payload.bio,
                password: hashedPassword,
                role: payload.role,
                profile: {
                    create: {
                    }
                }
            }
        })
        const { password, ...safeUser } = createAdmin
        return {
            success: true,
            data: safeUser
        }
    }

}
