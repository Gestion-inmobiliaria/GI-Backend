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
    // 🔍 Verifica si el endpoint está marcado como público
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
  
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const token = request.headers.authorization?.split(' ')[1];
      if (!token || Array.isArray(token)) {
        throw new UnauthorizedException('Token no encontrado');
      }
  
      const managerToken: IUserToken | string = userToken(token);
      if (typeof managerToken === 'string') {
        throw new UnauthorizedException(managerToken);
      }
      if (managerToken.isExpired) {
        throw new UnauthorizedException('Token expirado');
      }
  
      const user = await this.userService.findOneAuth(managerToken.sub);
  
      request.userId = user.id;
      request.roleId = user.role.id;
  
      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException('Error al validar el token');
    }
  }
  
}
