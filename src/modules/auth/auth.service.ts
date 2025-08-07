import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/config/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { RedisService } from 'src/core/config/redis/redis.service';
import { MailesService } from './otp/Mailer.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private mailerService: MailesService
  ) { }

  async signJwt(user: {
    id: string;
    email: string;
    role: string;
  }): Promise<string> {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.signAsync(payload);
  }

  async register(
    payload: RegisterAuthDto,
    userAgent: string,
    ipAddress: string,
  ) {
    const { email, fullName, password, otp } = payload;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const existOtp = await this.redisService.get(`otp:${email}`);
    if (!existOtp || existOtp !== otp) {
      throw new ConflictException('Invalid or expired OTP code');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        full_name: fullName,
        password: hashedPassword,
        role: payload.role,
        is_verified: true,
      },
    });

    await this.prisma.profile.create({
      data: {
        user_id: user.id,
        skills: [],
      },
    });

    const token = await this.signJwt({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    const { password: _, ...safeUser } = user;
    return {
      message: 'User successfully registered',
      access_token: token,
      data: safeUser,
    };
  }

  async login(payload: LoginAuthDto) {
    const { email, password } = payload;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      throw new ConflictException('Invalid email or password');
    }

    const token = await this.signJwt({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    const { password: _, ...safeUser } = user;
    return {
      message: 'Login successful',
      access_token: token,
      data: safeUser,
    };
  }

  async validateOAuthLogin(profile: any, accessToken: string) {
    const { id: googleId, name, emails, photos } = profile;
    const email = emails?.[0]?.value;

    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          full_name: `${name?.givenName} ${name?.familyName}`,
          password: null,
          role: 'CUSTOMER',
          is_verified: true,
        },
      });

      await this.prisma.profile.create({
        data: {
          user_id: user.id,
          avatar_url: photos?.[0]?.value,
          skills: [],
        },
      });
    }

    await this.prisma.oAuthAccount.upsert({
      where: {
        provider_providerUserId: {
          provider: 'google',
          providerUserId: googleId,
        },
      },
      update: {
        accessToken,
      },
      create: {
        userId: user.id,
        provider: 'google',
        providerUserId: googleId,
        accessToken,
      },
    });

    const token = await this.signJwt({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    const { password, ...safeUser } = user;
    return {
      message: !user ? 'Google registration successful' : 'Google login successful',
      access_token: token,
      data: safeUser,
    };
  }
  async resetPassword(email: string) {
    const existsExmail = await this.prisma.user.findUnique({ where: { email } })
    if (!existsExmail) throw new NotFoundException('user not found!')

    const emails = {
      email: existsExmail.email
    }
    await this.mailerService.sendToEmailOtpCode(emails)
    return {
      success: true,
      message: "send to verification code to your email!"
    }

  }
  async verifyResetPassword(otp: number, email: string, password: string) {
    const existsExmail = await this.prisma.user.findUnique({ where: { email } })
    if (!existsExmail) throw new NotFoundException('user not found!')

    const existsOtp = await this.redisService.get(`otp:${existsExmail.email}`)
    if (!existsOtp || existsOtp! == otp.toString()) throw new NotFoundException('Invalid or expired OTP')

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.prisma.user.update({
      where: { email }, data: {
        password: hashedPassword
      }
    })

    return {
      success: true,
      message: "password successfully updated!"
    }
  }
}
