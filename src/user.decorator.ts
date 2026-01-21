import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GetUserByUserDtoResponse } from './dtos/user.dto';

export interface UserPayload extends GetUserByUserDtoResponse {}

export const User = createParamDecorator(
  (
    data: keyof UserPayload | undefined,
    ctx: ExecutionContext,
  ): GetUserByUserDtoResponse | string | number | Date | undefined => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserPayload = request.user;
    return data ? (user as any)?.[data] : user;
  },
);
