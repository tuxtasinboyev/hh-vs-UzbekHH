import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ProfilesModule } from './profiles/profiles.module';
import { ProjectModule } from './project/project.module';
import { JwtModule } from '@nestjs/jwt';
import { GuardsService } from 'src/common/guards/guards.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService,GuardsService],
  imports: [ProfilesModule, ProjectModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret_key', // configdan olingan bo‘lishi mumkin
      signOptions: { expiresIn: '1d' },
    }),
  ],
})
export class UsersModule {}
