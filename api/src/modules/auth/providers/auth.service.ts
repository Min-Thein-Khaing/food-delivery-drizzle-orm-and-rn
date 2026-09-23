import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { RegisterDto } from '../dto/register.dto.js';
import { schema } from '../../../db/index.js';
import { eq } from 'drizzle-orm';
import { HashProvider } from './hash.provider.js';
import { User } from '../../../db/schema/user.js';
import { JwtService } from '@nestjs/jwt';
import { JwtPayLoad} from '../../../common/inteface.js';
import { LoginDto } from '../dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DB')
    private readonly db: NeonHttpDatabase,
    private readonly hashProvider: HashProvider,
    private readonly jwtService: JwtService,
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
    return {
      user: this.sanitizeUser(user),
      token: this.generateToken(user),
    };
  }

  async loginUser(loginDto:LoginDto): Promise<any> {
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

    return {
      user: this.sanitizeUser(user),
      token: this.generateToken(user),
    };
  }

  private sanitizeUser(user: User): any {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  private generateToken(
    user: User,
  ): string {
    const payload: JwtPayLoad = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload,{

    });
  }
}
