import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProjectService } from './project.service';
import { CreateProjectDto } from '../dto/create-user.dto';
import { UpdateProjectDto } from '../dto/update-user.dto';
import { ProjectStatus } from '@prisma/client';
import { GuardsService } from 'src/common/guards/guards.service';
import { RoleGuard } from 'src/common/role/role.service';
import { roles } from 'src/common/role/role.decorator';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('projects')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    @UseGuards(GuardsService, RoleGuard)
    @roles('CUSTOMER')
    @Post()
    @ApiOperation({ summary: 'Create new project' })
    async createProject(@Body() dto: CreateProjectDto, @Req() req) {
        const userId = req.user.id;
        return this.projectService.createProject(dto, userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all projects (with filters)' })
    @ApiQuery({ name: 'status', enum: ProjectStatus, required: false })
    @ApiQuery({ name: 'technologies', type: String, required: false })
    @ApiQuery({ name: 'budgetMin', type: String, required: false })
    @ApiQuery({ name: 'budgetMax', type: String, required: false })
    async getProjects(
        @Query('status') status?: ProjectStatus,
        @Query('technologies') technologies?: string,
        @Query('budgetMin') budgetMin?: string,
        @Query('budgetMax') budgetMax?: string,
    ) {
        return this.projectService.getProjects(status, technologies, budgetMin, budgetMax);
    }

    @UseGuards(GuardsService, RoleGuard)
    @roles('CUSTOMER')
    @Get('me')
    @ApiOperation({ summary: 'Get all my projects' })
    async getMeProjects(@Req() req) {
        const userId = req.user.id;
        return this.projectService.getMeProject(userId);
    }

    @UseGuards(GuardsService, RoleGuard)
    @roles('CUSTOMER')
    @Get('me/:id')
    @ApiOperation({ summary: 'Get my project by ID' })
    async getMeProjectById(@Req() req, @Param('id') id: string) {
        const userId = req.user.id;
        return this.projectService.getMeProjectById(userId, id);
    }

    @UseGuards(GuardsService, RoleGuard)
    @roles('CUSTOMER')
    @Put(':id')
    @ApiOperation({ summary: 'Update my project' })
    async updateProject(
        @Body() dto: UpdateProjectDto,
        @Req() req,
        @Param('id') id: string,
    ) {
        const userId = req.user.id;
        return this.projectService.updateProject(dto, userId, id);
    }

    @UseGuards(GuardsService, RoleGuard)
    @roles('CUSTOMER')
    @Delete(':id')
    @ApiOperation({ summary: 'Delete my project' })
    async deleteProject(@Param('id') id: string, @Req() req) {
        const userId = req.user.id;
        return this.projectService.deleteProject(id, userId);
    }
}
