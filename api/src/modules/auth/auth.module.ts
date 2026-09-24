import { Module } from '@nestjs/common';
import { AuthService } from './providers/auth.service.js';
import { AuthController } from './auth.controller.js';
import { HashProvider } from './providers/hash.provider.js';
import { BcryptProvider } from './providers/bcrypt.provider.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategys/jwt-strategy.js';
import { RefreshTokenStrategy } from './strategys/refresh-Token.js';
import { DbModule } from '../../db/db.module.js';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DbModule,
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
    JwtStrategy,
    RefreshTokenStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
