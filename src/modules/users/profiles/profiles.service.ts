import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/config/prisma/prisma.service';
import { UpdateProfileDto } from '../dto/create-user.dto';

@Injectable()
export class ProfilesService {
    constructor(private prismaService: PrismaService) { }
    async updateProfile(payload: UpdateProfileDto, userId: string, avatar_url?: string) {
        const existsUser = await this.prismaService.user.findUnique({ where: { id: userId } })
        if (!existsUser) throw new NotFoundException('user not foud')

        const updateProfile = await this.prismaService.profile.update({
            where: { user_id: userId },
            data: {
                avatar_url,
                experience: payload.experience,
                github_url: payload.github_url,
                linkedin_url: payload.linkedin_url,
                portfolio_url: payload.portfolio_url,
                skills: payload.skills,
                user_id: userId
            }
        })
        return {
            success: true,
            data: updateProfile
        }

    }
    async getME(user_id: string) {
        const existsUser = await this.prismaService.user.findUnique({ where: { id: user_id } })
        if (!existsUser) throw new NotFoundException('user not foud')

        const fidUserProfile = await this.prismaService.profile.findUnique({
            where: {
                user_id
            }
        })
        return {
            success: true,
            data: fidUserProfile
        }
    }
    async deleteProfileImg(user_id: string) {
        const existsUser = await this.prismaService.user.findUnique({ where: { id: user_id } })
        if (!existsUser) throw new NotFoundException('user not foud')

        const deleteProfileImg = await this.prismaService.profile.update({
            where: { user_id }, data: {
                avatar_url: null
            }
        })
        return {
            success: true,
            message: 'successfully  deleted img'
        }
    }
    async deleteProfile(user_id: string) {
        const existsUser = await this.prismaService.user.findUnique({ where: { id: user_id } })
        if (!existsUser) throw new NotFoundException('user not foud')
        await this.prismaService.profile.delete({
            where: { user_id }
        })
        return {
            success: true,
            message: "successfully deleted"
        }
    }

}
