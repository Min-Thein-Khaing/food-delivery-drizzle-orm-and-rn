import { Module } from '@nestjs/common';
import { AuthService } from './providers/auth.service.js';
import { AuthController } from './auth.controller.js';
import { HashProvider } from './providers/hash.provider.js';
import { BcryptProvider } from './providers/bcrypt.provider.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get<string>('JWT_SECRET'),
    signOptions: {
      expiresIn: '1d',
    },
  }),
}),
  ],
  providers: [
    AuthService,
    {
      provide: HashProvider,
      useClass: BcryptProvider,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
