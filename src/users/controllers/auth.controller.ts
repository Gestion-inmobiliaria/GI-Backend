// Importación de decoradores y módulos necesarios de NestJS
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger/dist/decorators';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
// Importación de DTOs, servicios y tipos personalizados
import { AuthDTO } from '../dto/auth.dto'; // DTO para manejar los datos de autenticación
import { AuthService } from '../services/auth.service'; // Servicio que contiene la lógica de autenticación
import { ResponseMessage } from '../../common/interfaces'; // Interfaz para estructurar las respuestas
import { RegisterUserDto } from 'src/users/dto/register-user.dto';

// Decorador para agrupar las rutas bajo la etiqueta 'Auth' en Swagger
@ApiTags('Auth')

// Decorador que define el controlador y el prefijo de las rutas
@Controller('auth')
export class AuthController {

  // Inyección de dependencias: se inyecta el servicio de autenticación
  constructor(private readonly authService: AuthService) { }

  // Ruta POST para iniciar sesión
  @Post('login')
  public async login(@Body() authDto: AuthDTO): Promise<ResponseMessage> {
    // Extrae el email y la contraseña del DTO recibido en el cuerpo de la solicitud
    const { email, password } = authDto;

    // Llama al servicio de autenticación para manejar el inicio de sesión
    return {
      statusCode: 200, // Código de estado HTTP
      data: await this.authService.login(email, password), // Respuesta del servicio
    };
  }

  // Ruta GET para verificar un token
  @ApiQuery({ name: 'token', type: 'string', required: true }) // Documentación del parámetro 'token' en Swagger
  @Get('checkToken')
  public async checkToken(@Query('token') token: string): Promise<ResponseMessage> {
    // Llama al servicio de autenticación para verificar el token
    return {
      statusCode: 200, // Código de estado HTTP
      data: await this.authService.checkToken(token) // Respuesta del servicio
    };
  }

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    return this.authService.registerUser(dto);
  }

  // Comentarios de código para futuras implementaciones de rutas relacionadas con contraseñas

  // Ruta POST para solicitar restablecimiento de contraseña
  // @Post('forgot-password')
  // public async requestPasswordForgot(@Body() sendEmailDTO: SendEmailDTO): Promise<ResponseMessage> {
  // }

  // Ruta GET para verificar un token de restablecimiento de contraseña
  // @Get('checkToken-password/:token')
  // public async requestPasswordCheckToken(@Param() param): Promise<ResponseMessage> {
  // }

  // Ruta POST para restablecer la contraseña
  // @Post('reset-password')
  // public async requestPasswordReset(@Body() resetpasswordDto: ResetPasswordDTO): Promise<ResponseMessage> {
  // }
}
