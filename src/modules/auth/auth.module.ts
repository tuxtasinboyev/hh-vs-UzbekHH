import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/core/config/prisma/prisma.module';
import { RedisModule } from 'src/core/config/redis/redis.module';
import { MailesModule } from './otp/Mailer.module';

@Module({
  imports: [PassportModule.register({ session: true }),
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
  }),
  PrismaModule,
  RedisModule,
  JwtModule,
  MailesModule
],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
