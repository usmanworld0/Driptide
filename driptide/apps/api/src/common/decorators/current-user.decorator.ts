import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserProfile } from '@driptide/contracts';

export const CurrentUser = createParamDecorator(
  (data: keyof UserProfile | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UserProfile | undefined;
    return data && user ? user[data] : user;
  },
);
