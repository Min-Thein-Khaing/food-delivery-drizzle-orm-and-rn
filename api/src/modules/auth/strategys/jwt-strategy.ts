import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
// @ts-expect-error passport-jwt may not include declarations in this setup.
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayLoad } from "../../../common/inteface.js";
import { schema } from "../../../db/index.js";
import { eq } from "drizzle-orm";
import { UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly config: ConfigService,
        @Inject('DB')
        private readonly db: NeonHttpDatabase
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>('JWT_SECRET'),
        });
    }


    async validate(payload: JwtPayLoad) {
        const [user] = await this.db.select().from(schema.user).where(eq(schema.user.id, payload.id));
        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}