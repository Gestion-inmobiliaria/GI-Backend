// Este archivo implementa el servicio `PermissionRoleService`.
// Su objetivo principal es manejar la lógica relacionada con la asociación entre permisos y roles, incluyendo:
// - Crear asociaciones entre permisos y roles.
// - Eliminar asociaciones existentes.
// - Consultar los permisos asignados a un rol específico.

// Importación de decoradores y módulos necesarios de NestJS
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // Decorador para inyectar repositorios de TypeORM
import { Repository } from 'typeorm'; // Repositorio para interactuar con la base de datos

// Importación de interfaces, entidades y utilidades personalizadas
import { ResponseMessage } from '../../common/interfaces'; // Interfaz para estructurar las respuestas
import { PermissionRoleEntity } from '../entities/permission-role.entity'; // Entidad que representa la relación entre permisos y roles
import { PermissionService } from './permission.service'; // Servicio para manejar la lógica de permisos
import { CreatePermissionRoleDto } from '../dto/create-permission-role.dto'; // DTO para crear asociaciones entre permisos y roles
import { handlerError } from 'src/common/utils/handlerError.utils'; // Utilidad para manejar errores

// Decorador que marca esta clase como un servicio inyectable
@Injectable()
export class PermissionRoleService {
  // Logger para registrar información y errores relacionados con el servicio
  private readonly logger = new Logger('PermissionRoleService');

  // Inyección de dependencias: repositorio de permisos-roles y servicio de permisos
  constructor(
    @InjectRepository(PermissionRoleEntity)
    private readonly permissionRoleRepository: Repository<PermissionRoleEntity>, // Repositorio para manejar la entidad PermissionRole
    private readonly permissionService: PermissionService, // Servicio para manejar permisos
  ) {}

  // Método para crear una nueva asociación entre un permiso y un rol
  public async create(createPermissionRoleDto: CreatePermissionRoleDto): Promise<PermissionRoleEntity> {
    try {
      const { permission, role } = createPermissionRoleDto;

      // Verifica si el permiso existe utilizando el servicio de permisos
      const permisoEntity = await this.permissionService.findOne(permission);
      if (!permisoEntity) throw new NotFoundException('Permission not found');

      // Crea una nueva asociación entre el permiso y el rol
      const permissionRoleCreated = this.permissionRoleRepository.create({
        permission: { id: permission },
        role: { id: role },
      });

      // Guarda la asociación en la base de datos
      await this.permissionRoleRepository.save(permissionRoleCreated);

      // Retorna la entidad creada
      return permissionRoleCreated;
    } catch (error) {
      // Maneja errores y los registra en el logger
      handlerError(error, this.logger);
    }
  }

  // Método para eliminar una asociación entre un permiso y un rol
  public async remove(id: string): Promise<ResponseMessage> {
    try {
      // Busca la asociación por su ID
      const permissionRole = await this.permissionRoleRepository.findOne({ where: { id } });
      if (!permissionRole) throw new NotFoundException('permission-role not found');

      // Elimina la asociación de la base de datos
      const permissionRoleDeleted = await this.permissionRoleRepository.delete(permissionRole);
      if (permissionRoleDeleted.affected === 0) throw new Error('Error deleting permission-role');

      // Retorna un mensaje de éxito
      return {
        message: 'Permission-role deleted successfully',
        statusCode: 200,
      };
    } catch (error) {
      // Maneja errores y los registra en el logger
      handlerError(error, this.logger);
    }
  }

  // Método para obtener los permisos asociados a un rol específico
  public async getPermissionsByRole(roleId: string): Promise<PermissionRoleEntity[]> {
    try {
      // Construye una consulta para obtener los permisos asociados al rol
      const query = this.permissionRoleRepository
        .createQueryBuilder('permissionRole')
        .leftJoinAndSelect('permissionRole.permission', 'permission') // Une la tabla de permisos
        .where('permissionRole.role.id = :roleId', { roleId }); // Filtra por el ID del rol

      // Ejecuta la consulta y retorna los resultados
      return await query.getMany();
    } catch (error) {
      // Maneja errores y los registra en el logger
      handlerError(error, this.logger);
    }
  }
}
