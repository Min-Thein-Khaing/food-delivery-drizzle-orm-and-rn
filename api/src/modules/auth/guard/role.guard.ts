import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../role/role.decorator.js';
import { UserRole } from '../dto/register.dto.js';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector
    ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
   const roleRequired = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
     if (!roleRequired) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return roleRequired.some((role) => user?.role === role);
  }
}