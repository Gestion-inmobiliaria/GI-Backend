// Este archivo implementa el servicio de autenticación (`AuthService`).
// Su objetivo principal es manejar la lógica de autenticación, incluyendo:
// - Validación de credenciales de usuario.
// - Generación de tokens JWT.
// - Verificación de tokens para validar sesiones activas.

// Importación de decoradores y módulos necesarios de NestJS
import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Servicio para acceder a variables de configuración

// Importación de librerías externas
import * as bcrypt from 'bcrypt'; // Librería para manejar el hash de contraseñas
import * as jwt from 'jsonwebtoken'; // Librería para manejar tokens JWT

// Importación de servicios, entidades, interfaces y utilidades personalizadas
import { UserService } from 'src/users/services/users.service'; // Servicio para manejar la lógica de usuarios
import { UserEntity } from 'src/users/entities/user.entity'; // Entidad que representa a los usuarios
import { IPayload } from '../interfaces/payload.interface'; // Interfaz para el payload del token JWT
import { IGenerateToken } from '../interfaces/generate-token.interface'; // Interfaz para generar un token
import { IUserToken } from '../interfaces/userToken.interface'; // Interfaz para representar un token de usuario
import { userToken } from '../utils/user-token.utils'; // Utilidad para decodificar y validar tokens
import { handlerError } from 'src/common/utils/handlerError.utils'; // Utilidad para manejar errores
import { CreateUserDto } from '../dto';

// Decorador que marca esta clase como un servicio inyectable
@Injectable()
export class AuthService {
  // Logger para registrar información y errores relacionados con el servicio
  private readonly logger = new Logger('AuthService');

  // Inyección de dependencias: servicio de usuarios y servicio de configuración
  constructor(
    private readonly userService: UserService, // Servicio para manejar usuarios
    private readonly configService: ConfigService, // Servicio para acceder a variables de configuración
  ) { }

  // Método para manejar el inicio de sesión
  public async login(email: string, password: string): Promise<any> {
    try {
      // Busca al usuario en la base de datos por su email
      const user = await this.userService.findOneBy({
        key: 'email',
        value: email,
      });

      // Verifica si la contraseña es válida y si el usuario está activo
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!user || !isPasswordValid || !user.isActive)
        throw new NotFoundException('Usuario o contraseña incorrectos');

      // Genera un token JWT para el usuario autenticado
      return this.generateJWT(user);
    } catch (error) {
      // Maneja errores y los registra en el logger
      handlerError(error, this.logger);
    }
  }

  async registerUser(dto: CreateUserDto) {
    const CLIENT_ROLE_ID = '6122fa96-0640-46fc-80cc-eba2e3179c15'; // UUID real del rol Cliente

    if (dto.role && dto.role !== CLIENT_ROLE_ID) {
      throw new ForbiddenException('No tienes permiso para asignar ese rol.');
    }

    // 🔍 Validar si ya existe un usuario con el mismo CI
    const existingCI = await this.userService.existsBy('ci', dto.ci);
    if (existingCI) {
      throw new ForbiddenException('El CI ya está registrado');
    }

    // Validar email duplicado
    const existingEmail = await this.userService.existsBy('email', dto.email);
    if (existingEmail) {
      throw new ForbiddenException('El correo electrónico ya está registrado');
    }

    // Crear nuevo usuario
    const newUser = await this.userService.create({
      ...dto,
      role: CLIENT_ROLE_ID,
    });

    return { message: 'Usuario creado exitosamente', userId: newUser.id };
  }



  // Método para verificar la validez de un token
  public async checkToken(token: string): Promise<UserEntity> {
    try {
      // Decodifica y valida el token utilizando la utilidad `userToken`
      const managerToken: IUserToken | string = userToken(token);

      // Si el token es inválido o ha expirado, lanza una excepción
      if (typeof managerToken === 'string')
        throw new NotFoundException('Token invalido');
      if (managerToken.isExpired) throw new NotFoundException('Token expirado');

      // Busca al usuario asociado al token en la base de datos
      const user = await this.userService.findOneAuth(managerToken.sub);
      return user;
    } catch (error) {
      // Maneja errores y los registra en el logger
      handlerError(error, this.logger);
    }
  }

  // Método para generar un token JWT para un usuario
  public async generateJWT(user: UserEntity): Promise<any> {
    // Obtiene información actualizada del usuario desde la base de datos
    const userLogged: UserEntity = await this.userService.findOne(user.id);

    // Define el payload del token con información del usuario
    const payload: IPayload = {
      sub: userLogged.id, // ID del usuario
      role: userLogged.role.id, // ID del rol del usuario
    };

    // Genera el token JWT utilizando el método `singJWT`
    const accessToken = this.singJWT({
      payload,
      secret: this.configService.get('JWT_AUTH'), // Clave secreta desde las variables de configuración
      expiresIn: 28800, // Tiempo de expiración del token (8 horas)
    });

    // Retorna el token y la información del usuario
    return {
      accessToken,
      User: userLogged,
    };
  }

  // Método para firmar un token JWT
  public singJWT({ payload, secret, expiresIn }: IGenerateToken) {
    // Opciones para la generación del token
    const options: jwt.SignOptions = { expiresIn: expiresIn as any }; // Fuerza a un tipo compatible

    // Genera y retorna el token firmado
    return jwt.sign(payload, secret, options);
  }
}
