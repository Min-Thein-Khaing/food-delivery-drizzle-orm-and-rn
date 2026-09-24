import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { RegisterDto } from '../dto/register.dto.js';
import { schema } from '../../../db/index.js';
import { eq } from 'drizzle-orm';
import { HashProvider } from './hash.provider.js';
import { User } from '../../../db/schema/user.js';
import { JwtService } from '@nestjs/jwt';
import { JwtPayLoad } from '../../../common/inteface.js';
import { LoginDto } from '../dto/login.dto.js';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DB')
    private readonly db: NeonHttpDatabase,
    private readonly hashProvider: HashProvider,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async registerUser(registerDto: RegisterDto): Promise<any> {
    const { email, password, role, firstName, lastName } = registerDto;
    const [existingEmail] = await this.db
      .select()
      .from(schema.user)
      .where(eq(schema.user.email, email));

    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await this.hashProvider.hash(password);

    const [user] = await this.db
      .insert(schema.user)
      .values({
        email,
        password: hashedPassword,
        role,
        firstName,
        lastName,
      })
      .returning();
    const userResponse = this.sanitizeUser(user)
    const  token= await this.generateToken(user)
    await this.updateRefreshToken(user.id,  token.refreshToken);
    return {
      user: userResponse,
      token
    };
  }

  async loginUser(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;
    const [user] = await this.db
      .select()
      .from(schema.user)
      .where(eq(schema.user.email, email));

    if (!user) {
      throw new ConflictException('Invalid email or password');
    }

    const isMatch = await this.hashProvider.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const userResponse = this.sanitizeUser(user)
    const  token= await this.generateToken(user)
    await this.updateRefreshToken(user.id,  token.refreshToken);
    return {
      user: userResponse,
      token
    };
  }

 async updateRefreshToken(
  userId: string,
  refreshToken: string,
): Promise<typeof schema.user.$inferSelect> {
  const hashedRefreshToken = await this.hashProvider.hash(refreshToken);

  const [updatedUser] = await this.db
    .update(schema.user)
    .set({
      refreshToken: hashedRefreshToken,
    })
    .where(eq(schema.user.id, userId))
    .returning();

  return updatedUser;
}
async logout(userId:string) {
  await this.db
    .update(schema.user)
    .set({
      refreshToken: null,
    })
    .where(eq(schema.user.id, userId));
}

async refreshTokenGenerate(userId: string, refreshToken: string) {
  const [user] = await this.db
    .select()
    .from(schema.user)
    .where(eq(schema.user.id, userId));
  if (!user || !refreshToken) {
    throw new UnauthorizedException('Invalid Refresh Token');
  }

  const token = await this.generateToken(user);
  await this.updateRefreshToken(user.id, token.refreshToken);
  return token;
}




  private sanitizeUser(user: User): any {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

 private async generateToken(user: User): Promise<{accessToken: string,refreshToken:string}> {
     const payload: JwtPayLoad = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const refreshIdToken = randomBytes(16).toString('hex');
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(
        {
          ...payload,
          refreshIdToken,
        },
        {
          secret: this.configService.getOrThrow<string>('JWT_REFRESHTOKEN'),
          expiresIn: '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
