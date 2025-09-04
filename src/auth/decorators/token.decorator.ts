import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

type AuthenticatedtokenRequest = Request & {
  token?: string;
};
export const Token = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<AuthenticatedtokenRequest>();

  if (!request.token) {
    throw new InternalServerErrorException('Token not found in request (authGuard called?)');
  }
  return request.token;
});
