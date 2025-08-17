import { Controller, Get, Patch, Delete, UseGuards, Param, Body, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from '../dto/create-user.dto';
import { GuardsService } from 'src/common/guards/guards.service';
import { RoleGuard } from 'src/common/role/role.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import * as multer from 'multer';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfilesController {
    constructor(private readonly profilesService: ProfilesService) { }

    @UseGuards(GuardsService, RoleGuard)
    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'User profile retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    async getMe(@Req() req: Request) {
        return this.profilesService.getME(req['user'].id);
    }

    @UseGuards(GuardsService, RoleGuard)
    @UseInterceptors(
        FileInterceptor('img', {
            storage: multer.diskStorage({
                destination(req, file, callback) {
                    callback(null, './uploads');
                },
                filename: (req, file, callback) => {
                    const fileName = `${Date.now()}-${file.originalname}`;
                    callback(null, fileName);
                },
            }),
        })
    )
    @Patch('me')
    @ApiOperation({ summary: 'Update current user profile' })
    @ApiResponse({ status: 200, description: 'User profile updated successfully.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    @ApiConsumes('multipart/form-data')
    async updateProfile(
        @Req() req: Request,
        @Body() payload: UpdateProfileDto,
        @UploadedFile() img: Express.Multer.File
    ) {
        return this.profilesService.updateProfile(payload, req['user'].id, img.filename);
    }

    @UseGuards(GuardsService, RoleGuard)
    @Delete('me/avatar')
    @ApiOperation({ summary: 'Delete current user profile image' })
    @ApiResponse({ status: 200, description: 'User profile image deleted successfully.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    async deleteProfileImg(@Req() req: Request) {
        return this.profilesService.deleteProfileImg(req['user'].id);
    }

    @UseGuards(GuardsService, RoleGuard)
    @Delete('me')
    @ApiOperation({ summary: 'Delete current user profile' })
    @ApiResponse({ status: 200, description: 'User profile deleted successfully.' })
    @ApiResponse({ status: 404, description: 'User not found.' })
    async deleteProfile(@Req() req: Request) {
        return this.profilesService.deleteProfile(req['user'].id);
    }
}
