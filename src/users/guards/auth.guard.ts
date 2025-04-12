// Importación de decoradores y módulos necesarios de NestJS
import {
  CanActivate, // Interfaz para implementar un guard
  ExecutionContext, // Proporciona el contexto de ejecución de la solicitud
  Injectable, // Decorador para marcar la clase como inyectable
  InternalServerErrorException, // Excepción para errores internos del servidor
  UnauthorizedException, // Excepción para errores de autenticación
} from '@nestjs/common';
import { Reflector } from '@nestjs/core'; // Utilizado para acceder a metadatos personalizados
import { Request } from 'express'; // Tipo para representar solicitudes HTTP
import { UserService } from 'src/users/services/users.service'; // Servicio para manejar la lógica de usuarios
import { IUserToken } from '../interfaces/userToken.interface'; // Interfaz para representar el token de usuario
import { userToken } from '../utils/user-token.utils'; // Utilidad para decodificar y validar tokens

// Decorador que marca esta clase como un servicio inyectable
@Injectable()
export class AuthGuard implements CanActivate {
  // Inyección de dependencias: servicio de usuarios y reflector
  constructor(
    private readonly userService: UserService, // Servicio para obtener información del usuario
    private readonly reflector: Reflector, // Utilizado para leer metadatos personalizados
  ) {}

  // Método principal del guard que determina si se permite el acceso
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Obtiene la solicitud HTTP del contexto de ejecución
      const request = context.switchToHttp().getRequest<Request>();

      // Extrae el token de autorización del encabezado
      const token = request.headers.authorization?.split(' ')[1];
      if (!token || Array.isArray(token)) {
        // Lanza una excepción si no se encuentra el token o es inválido
        throw new UnauthorizedException('Token no encontrado');
      }

      // Decodifica y valida el token utilizando la utilidad `userToken`
      const managerToken: IUserToken | string = userToken(token);
      if (typeof managerToken === 'string') {
        // Si la utilidad devuelve un mensaje de error, lanza una excepción
        throw new UnauthorizedException(managerToken);
      }
      if (managerToken.isExpired) {
        // Lanza una excepción si el token ha expirado
        throw new UnauthorizedException('Token expirado');
      }

      // Busca al usuario en la base de datos utilizando el ID del token
      const user = await this.userService.findOneAuth(managerToken.sub);

      // Agrega información del usuario a la solicitud para su uso posterior
      request.userId = user.id; // ID del usuario autenticado
      request.roleId = user.role.id; // ID del rol del usuario

      // Si todo es válido, permite el acceso
      return true;
    } catch (error) {
      // Si ocurre una excepción de autenticación, la lanza directamente
      if (error instanceof UnauthorizedException) throw error;

      // Si ocurre cualquier otro error, lanza una excepción interna del servidor
      throw new InternalServerErrorException('Error al validar el token');
    }
  }
}
