import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiTags, ApiBearerAuth } from '@nestjs/swagger/dist/decorators';
import { Request } from 'express';

import { AuthDTO } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { ResponseMessage } from '../../common/interfaces';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { RegisterUserDto } from '../dto/create-user.dto';
import { AuthGuard } from '../guards/auth.guard';

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

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  public async logout(@Req() request: Request): Promise<ResponseMessage> {
    // No es necesario invalidar el token en el backend si usamos JWT,
    // pero podríamos implementar una blacklist de tokens si fuera necesario
    return {
      statusCode: 200,
      message: 'Sesión cerrada correctamente'
    };
  }

  @Post('customer/login')
  public async customerLogin(@Body() authDto: AuthDTO): Promise<ResponseMessage> {
    const { email, password } = authDto;
    return {
      statusCode: 200,
      data: await this.authService.login(email, password),
    };
  }

  @Post('customer/register')
  public async customerRegister(@Body() dto: CreateCustomerDto): Promise<ResponseMessage> {
    return {
      statusCode: 201,
      data: await this.authService.registerCustomer(dto),
    };
  }

  @Post('register')
  public async register(@Body() register: RegisterUserDto): Promise<ResponseMessage> {
    return {
      statusCode: 201,
      data: await this.authService.register(register),
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
