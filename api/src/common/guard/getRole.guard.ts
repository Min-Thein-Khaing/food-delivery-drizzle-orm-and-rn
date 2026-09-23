import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayLoad } from '../inteface.js';

export const GetUser = createParamDecorator(
  (data: keyof JwtPayLoad | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtPayLoad }>();
    return data ? request.user?.[data] : request.user;
  },
);
