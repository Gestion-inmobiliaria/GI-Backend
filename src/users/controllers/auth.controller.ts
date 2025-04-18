import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger/dist/decorators';

import { AuthDTO } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { ResponseMessage } from '../../common/interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  @Post('login')
  public async login(@Body() authDto: AuthDTO): Promise<ResponseMessage> {
    const { email, password } = authDto;
    return {
      statusCode: 200,
      data: await this.authService.login(email, password),
    };
  }

  @ApiQuery({ name: 'token', type: 'string', required: true })
  @Get('checkToken')
  public async checkToken(@Query('token') token: string): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.authService.checkToken(token)
    };
  }

  // @Post('forgot-password')
  // public async requestPasswordForgot(@Body() sendEmailDTO: SendEmailDTO): Promise<ResponseMessage> {
  // }

  // @Get('checkToken-password/:token')
  // public async requestPasswordCheckToken(@Param() param): Promise<ResponseMessage> {
  // }

  // @Post('reset-password')
  // public async requestPasswordReset(@Body() resetpasswordDto: ResetPasswordDTO): Promise<ResponseMessage> {
  // }
}
