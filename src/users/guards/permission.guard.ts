// Este archivo implementa un guard llamado `PermissionGuard`.
// Su objetivo principal es verificar si el usuario autenticado tiene los permisos necesarios
// para acceder a una ruta específica. Si no tiene los permisos requeridos, se lanza una excepción.

// Importación de decoradores y módulos necesarios de NestJS
import {
  CanActivate, // Interfaz para implementar un guard
  ExecutionContext, // Proporciona el contexto de ejecución de la solicitud
  Injectable, // Decorador para marcar la clase como inyectable
  InternalServerErrorException, // Excepción para errores internos del servidor
  UnauthorizedException, // Excepción para errores de autorización
} from '@nestjs/common';
import { Reflector } from '@nestjs/core'; // Utilizado para acceder a metadatos personalizados
import { Request } from 'express'; // Tipo para representar solicitudes HTTP

// Importación de constantes y servicios personalizados
import {
  PERMISSION, // Enumeración de permisos disponibles
  PERMISSION_KEY, // Clave utilizada para definir permisos en las rutas
} from '../../users/constants/permission.constant';
import { PermissionRoleService } from '../services/permission-role.service'; // Servicio para obtener permisos asociados a roles

// Decorador que marca esta clase como un servicio inyectable
@Injectable()
export class PermissionGuard implements CanActivate {
  // Inyección de dependencias: reflector y servicio de permisos por rol
  constructor(
    private readonly reflector: Reflector, // Utilizado para leer metadatos personalizados
    private readonly permissionRoleService: PermissionRoleService, // Servicio para manejar permisos asociados a roles
  ) {}

  // Método principal del guard que determina si se permite el acceso
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Obtiene los permisos requeridos para acceder a la ruta desde los metadatos
      const permissionRequire = this.reflector.get<Array<PERMISSION>>(
        PERMISSION_KEY, // Clave utilizada para definir permisos
        context.getHandler(), // Obtiene el manejador de la ruta actual
      );

      // Obtiene la solicitud HTTP del contexto de ejecución
      const request = context.switchToHttp().getRequest<Request>();

      // Si no se requieren permisos para acceder a la ruta, se permite el acceso
      if (permissionRequire === undefined || permissionRequire.length === 0)
        return true;

      // Obtiene el ID del rol del usuario desde la solicitud
      const { roleId } = request;

      // Obtiene los permisos asociados al rol del usuario
      const permissionsUser =
        await this.permissionRoleService.getPermissionsByRole(roleId);

      // Extrae solo los nombres de los permisos
      const permissionArrayName = permissionsUser.map(
        (permission) => permission.permission.name,
      );

      let isAuthorized = false;
      // Verifica si el usuario tiene al menos uno de los permisos requeridos
      permissionArrayName.forEach((permission) => {
        if (permissionRequire.includes(permission as PERMISSION))
          return (isAuthorized = true);
      });

      // Si el usuario no tiene permisos para acceder a la ruta, lanza una excepción
      if (!isAuthorized)
        throw new UnauthorizedException(
          'No tienes permisos para acceder a esta ruta.',
        );

      // Si todo es válido, permite el acceso
      return true;
    } catch (error) {
      // Si ocurre una excepción de autorización, la lanza directamente
      if (error instanceof UnauthorizedException) throw error;

      // Si ocurre cualquier otro error, lanza una excepción interna del servidor
      throw new InternalServerErrorException('Error al validar los permisos');
    }
  }
}
