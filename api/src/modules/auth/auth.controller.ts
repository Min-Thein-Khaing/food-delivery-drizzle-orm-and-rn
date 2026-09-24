import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './providers/auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { JwtTokenGuard } from './guard/jwt-token.guard.js';
import { JwtRefreshTokenGuard } from './guard/refresh-token.guard.js';
import { GetUser } from '../../common/guard/getRole.guard.js';
import type { User } from '../../db/schema/user.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.loginUser(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.registerUser(registerDto);
  }

  @Post('logout')
  @UseGuards(JwtTokenGuard)
  async logout(@GetUser() user: User) {
    return this.authService.logout(user.id);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshTokenGuard)
  async refresh(@GetUser() user: User & { refreshToken: string }) {
    return this.authService.refreshTokenGenerate(user.id, user.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtTokenGuard)
  async getProfile(@GetUser() user: User) {
    return user;
  }
}
