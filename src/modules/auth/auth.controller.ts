import {
  Controller,
  Get,
  Req,
  UseGuards,
  UnauthorizedException,
  Post,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login.dto';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: '🔐 Start Google Authentication' })
  @ApiResponse({ status: 200, description: 'Redirects to Google for login' })
  async googleAuth() {
    // Passport handles redirection
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: '✅ Google Authentication Callback' })
  @ApiResponse({ status: 200, description: 'Google login successful, token returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized: Google auth failed' })
  async googleAuthRedirect(@Req() req: Request) {
    try {
      const { profile, access_token } = req['user'];

      const userAgent = req.headers['user-agent'] || 'unknown';
      const ip =
        req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress ||
        'unknown';

      return await this.authService.validateOAuthLogin(
        profile,
        access_token,
      );
    } catch (err) {
      console.error('Google auth error:', err);
      throw new UnauthorizedException('Google auth failed');
    }
  }

  @Post('register')
  @ApiOperation({ summary: '📥 Register with Email + OTP' })
  @ApiBody({ type: RegisterAuthDto })
  @ApiResponse({ status: 201, description: '✅ User successfully registered' })
  @ApiResponse({ status: 409, description: '❌ Email already exists or OTP invalid' })
  async register(@Body() dto: RegisterAuthDto, @Req() req: Request) {
    const userAgent = req.headers['user-agent'] || 'unknown';
    const ip =
      req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress ||
      'unknown';

    return this.authService.register(dto, userAgent, ip.toString());
  }

  @Post('login')
  @ApiOperation({ summary: '🔑 Login with Email & Password' })
  @ApiBody({ type: LoginAuthDto })
  @ApiResponse({ status: 200, description: '✅ Login successful, access_token returned' })
  @ApiResponse({ status: 404, description: '❌ User not found' })
  @ApiResponse({ status: 409, description: '❌ Invalid email or password' })
  async login(@Body() dto: LoginAuthDto, @Req() req: Request) {

    return this.authService.login(dto);
  }
  @Post('reset-password')
  @ApiOperation({ summary: 'Send reset password OTP to email' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
      },
      required: ['email'],
    },
  })
  async resetPassword(@Body() body: any) {
    const { email } = body;
    if (!email) throw new NotFoundException('Email is required');
    return this.authService.resetPassword(email);
  }

  @Post('verify-reset-password')
  @ApiOperation({ summary: 'Verify OTP and reset password' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        otp: { type: 'number', example: 123456 },
        password: { type: 'string', example: 'NewSecurePassword123!' },
      },
      required: ['email', 'otp', 'password'],
    },
  })
  async verifyResetPassword(@Body() body: any) {
    const { otp, email, password } = body;
    if (!email || !otp || !password) {
      throw new NotFoundException('Email, OTP, and password are required');
    }

    return this.authService.verifyResetPassword(otp, email, password);
  }

}
