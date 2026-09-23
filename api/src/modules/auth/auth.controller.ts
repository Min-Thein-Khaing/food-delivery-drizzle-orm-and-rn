import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './providers/auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { JwtPayLoad } from '../../common/inteface.js';
import { JwtTokenGuard } from './guard/jwt-token.guard.js';
import { GetUser } from '../../common/guard/getRole.guard.js';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.loginUser(loginDto);
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.registerUser(registerDto);
    }

    @Get('me')
    @UseGuards(JwtTokenGuard)
    async getProfile(@GetUser() user:any) {
        return user.sub + user.email + user.role;
    }
}
