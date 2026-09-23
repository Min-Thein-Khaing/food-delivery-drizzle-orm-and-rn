import { JwtPayLoad } from './../../../common/inteface.js';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class JwtTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest<Request & {user: JwtPayLoad}>();
    const authHeader = request.headers['authorization'] ?request.headers['authorization'].split('Bearer '): [];
    if (!authHeader[1]) {
      return false;
    }
    try {
      const payload = this.jwtService.verify(authHeader[1]);
      request.user = payload;
      return true;
    } catch {
      return false;
    }
  }
}
