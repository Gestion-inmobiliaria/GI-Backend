import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger/dist/decorators';
import { AuthDTO } from '../dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { ResponseMessage } from '../../common/interfaces';



@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor( private readonly authService: AuthService ) {}

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

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
        // Este endpoint redirige al usuario a la página de inicio de sesión de Google
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req) {
        // Aquí se maneja la redirección después de la autenticación
        return {
            message: 'Usuario autenticado con Google',
            user: req.user,
        };
    }

    // @Post('forgot-password')
    //     public async requestPasswordForgot(@Body() sendEmailDTO: SendEmailDTO): Promise<ResponseMessage> {
    // }

    // @Get('checkToken-password/:token')
    //     public async requestPasswordCheckToken(@Param() param): Promise<ResponseMessage> {
    // }

    // @Post('reset-password')
    //     public async requestPasswordReset(@Body() resetpasswordDto: ResetPasswordDTO): Promise<ResponseMessage> {
    // }

    // boo
}
