import { createParamDecorator, ExecutionContext, InternalServerErrorException, Logger } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    Logger.log({ data });
    const req = ctx.switchToHttp().getRequest();
    const user = req.userId;
    if (!user)
      throw new InternalServerErrorException('User not found (request)');
    // return data ? user : user[data];
    return user ? user : user[data];
  }
);