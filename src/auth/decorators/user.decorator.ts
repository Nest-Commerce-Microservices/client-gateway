import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { ICurrentUser } from '../interfaces/current-user.interface';

type AuthenticatedUserRequest = Request & {
  user?: ICurrentUser;
};

export const User = createParamDecorator(
  (data: keyof ICurrentUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedUserRequest>();

    if (!request.user) {
      throw new InternalServerErrorException('User not found in request (authGuard called?)');
    }

    return request.user;
  },
);
