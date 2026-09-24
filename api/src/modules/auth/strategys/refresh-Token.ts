import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express'; // Express Request ကို သုံးထားသည်
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
// @ts-expect-error passport-jwt may not include declarations in this setup.
import { ExtractJwt, Strategy } from 'passport-jwt';
import { schema } from '../../../db/index.js';
import { eq } from 'drizzle-orm';
import { HashProvider } from '../providers/hash.provider.js';

interface JwtPayload{
    id:string,
    email:string
}
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly config: ConfigService,
    @Inject('DB')
    private readonly db: NeonHttpDatabase,
    private readonly hashProvider: HashProvider,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_REFRESHTOKEN'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    // 1. Authorization Header မှ Refresh Token ကို သေချာထုတ်ယူခြင်း
    const authHeader = req.get('authorization');
    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const refreshToken = authHeader.replace('Bearer ', '').trim();

    const [user] = await this.db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, payload.id));

    // 3. User မရှိရင် သို့မဟုတ် DB ထဲမှာ Refresh Token မရှိရင်
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    // 4. Token နှစ်ခုကို Hash Compare လုပ်ပြီး စစ်ဆေးခြင်း
    const isTokenMatching = await this.hashProvider.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isTokenMatching) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    return {
      ...user,
      refreshToken,
    };
  }
}