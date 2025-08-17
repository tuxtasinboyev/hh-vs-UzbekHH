import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/config/prisma/prisma.service';
import { MailesService } from 'src/modules/auth/otp/Mailer.service';
import { CreateProjectDto } from '../dto/create-user.dto';
import { ProjectStatus } from '@prisma/client';
import { UpdateProjectDto } from '../dto/update-user.dto';

@Injectable()
export class ProjectService {
    constructor(private prisma: PrismaService, private mailesService: MailesService) { }

    async createProject(payload: CreateProjectDto, user_id: string) {

        const existingUser = await this.prisma.user.findUnique({ where: { id: user_id } })
        if (!existingUser) throw new NotFoundException('user not found!')

        const matchingDevelopers = await this.prisma.user.findMany({
            where: {
                role: 'DEVELOPER',
                profile: {
                    skills: {
                        hasSome: payload.technologies
                    }
                }
            },
            include: {
                profile: true
            }
        })
        for (const dev of matchingDevelopers) {
            await this.mailesService.sendProject(
                dev.email, payload.title, payload.description, payload.budget, payload.deadline, payload.technologies
            );
        }
        const createProject = await this.prisma.project.create({
            data: {
                budget: payload.budget,
                deadline: payload.deadline,
                description: payload.description,
                title: payload.title,
                customer_id: user_id,
                status: 'OPEN',
                technologies: payload.technologies,
            }
        })
        return {
            success: true,
            message: "successfully created",
            data: createProject
        }
    }
    async getProjects(
        status?: ProjectStatus,
        technologies?: string,
        budgetMin?: string,
        budgetMax?: string,
    ) {
        const filters: any = {};

        if (status) {
            filters.status = status;
        }

        if (technologies) {
            const techArray = technologies.split(',').map((t) => t.trim());
            filters.technologies = { hasSome: techArray };
        }

        if (budgetMin || budgetMax) {
            filters.budget = {};
            if (budgetMin) filters.budget.gte = Number(budgetMin);
            if (budgetMax) filters.budget.lte = Number(budgetMax);
        }

        const data = await this.prisma.project.findMany({
            where: filters,
            orderBy: { created_at: 'desc' },
        });
        return {
            success: true,
            data: data
        }
    }
    async getMeProject(user_id: string) {
        const existingUser = await this.prisma.user.findUnique({ where: { id: user_id } })
        if (!existingUser) throw new NotFoundException('user not found!')

        const findProject = await this.prisma.project.findMany({ where: { customer_id: user_id } })
        return {
            success: true,
            data: findProject
        }
    } async getMeProjectById(user_id: string, id: string) {
        const existingUser = await this.prisma.user.findUnique({ where: { id: user_id } })
        if (!existingUser) throw new NotFoundException('user not found!')

        const findProject = await this.prisma.project.findUnique({ where: { id, customer_id: user_id } })
        if (!findProject) throw new NotFoundException('project not found!')
        return {
            success: true,
            data: findProject
        }
    }
    async updateProject(payload: UpdateProjectDto, user_id: string, id: string) {
        const existingUser = await this.prisma.user.findUnique({ where: { id: user_id } })
        if (!existingUser) throw new NotFoundException('user not found!')

        const existsProject = await this.prisma.project.findUnique({ where: { id } })
        if (!existsProject) throw new NotFoundException('Project not found')

        const updated = await this.prisma.project.updateMany({
            where: { AND: [{ id }, { customer_id: user_id }] }, data: {
                budget: payload.budget,
                customer_id: user_id,
                deadline: payload.deadline,
                description: payload.description,
                status: payload.status,
                technologies: payload.technologies,
                title: payload.title
            }
        })
        return {
            success: true,
            data: updated
        }

    }
    async deleteProject(id: string, user_id: string) {
        const existingUser = await this.prisma.user.findUnique({ where: { id: user_id } })
        if (!existingUser) throw new NotFoundException('user not found!')

        const existsProject = await this.prisma.project.findUnique({ where: { id } })
        if (!existsProject) throw new NotFoundException('client\'s project not found')

        await this.prisma.project.delete({ where: { id, customer_id: user_id } })
    }

}
