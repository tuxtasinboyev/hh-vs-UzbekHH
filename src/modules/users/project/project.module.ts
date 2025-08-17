import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { PrismaModule } from 'src/core/config/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { MailesModule } from 'src/modules/auth/otp/Mailer.module';

@Module({
  imports: [PrismaModule, JwtModule,MailesModule],
  providers: [ProjectService],
  controllers: [ProjectController]
})
export class ProjectModule { }
