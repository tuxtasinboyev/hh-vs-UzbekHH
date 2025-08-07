import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  Patch,
  Body,
  Delete,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAdminDto } from './dto/create-user.dto';
import { GuardsService } from 'src/common/guards/guards.service';
import { RoleGuard } from 'src/common/role/role.service';
import { roles } from 'src/common/role/role.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(GuardsService)
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile (me)' })
  async getMe(@Req() req: Request) {
    const userId = req['user'].id;
    return this.usersService.getMe(userId);
  }

  @UseGuards(GuardsService)
  @Patch('me')
  @ApiOperation({ summary: 'Update current user account info (me)' })
  async updateAccountMe(@Body() payload: UpdateUserDto, @Req() req: Request) {
    const userId = req['user'].id;
    return this.usersService.updateAccountMe(payload, userId);
  }

  @UseGuards(GuardsService, RoleGuard)
  @roles('ADMIN')
  @Get()
  @ApiOperation({ summary: 'Get all users (admin panel)' })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name or email' })
  @ApiQuery({ name: 'role', required: false, description: 'Filter by user role (ADMIN, CUSTOMER, DEVELOPER)' })
  @ApiQuery({ name: 'id', required: false, description: 'Filter by user ID' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', type: Number })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort field (created_at, full_name, etc.)' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'asc | desc' })
  async findAll(@Query() query: {
    search?: string;
    role?: string;
    id?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    return this.usersService.findAllUsers(query);
  }

  @UseGuards(GuardsService)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @UseGuards(GuardsService)
  @Post('admin')
  @ApiOperation({ summary: 'Create new admin user' })
  async createAdmin(@Body() payload: CreateAdminDto) {
    return this.usersService.createAdmin(payload);
  }
}
