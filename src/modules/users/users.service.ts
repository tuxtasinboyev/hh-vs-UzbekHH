import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/core/config/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService) { }
    async getMe(userId: string) {
        const existsUser = await this.prismaService.user.findUnique({ where: { id: userId } })
        if (!existsUser) throw new NotFoundException('user not found!')
    }
}
