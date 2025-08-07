import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ProfilesModule } from './profiles/profiles.module';
import { ProjectModule } from './project/project.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [ProfilesModule, ProjectModule],
})
export class UsersModule {}
