// Importación de decoradores y módulos necesarios de NestJS
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from '../services/role.service'; // Servicio que contiene la lógica de roles
import { CreateRoleDto, UpdateRoleDto } from '../dto'; // DTOs para crear y actualizar roles
import { ResponseMessage } from 'src/common/interfaces'; // Interfaz para estructurar las respuestas
import { QueryDto } from 'src/common/dto/query.dto'; // DTO para manejar parámetros de consulta
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'; // Decoradores para documentación con Swagger
import { AuthGuard } from '../guards/auth.guard'; // Guard para manejar la autenticación
import { PermissionGuard } from '../guards/permission.guard'; // Guard para manejar permisos
import { PermissionAccess } from '../decorators/permissions.decorator'; // Decorador para verificar permisos
import { PERMISSION } from '../constants/permission.constant'; // Constantes de permisos
import { ORDER_ENUM } from 'src/common/constants'; // Enumeración para el orden de los datos

// Decoradores de Swagger y configuración del controlador
@ApiTags('Role') // Agrupa las rutas bajo la etiqueta 'Role' en Swagger
@ApiBearerAuth() // Indica que las rutas requieren autenticación con un token Bearer
@UseGuards(AuthGuard, PermissionGuard) // Aplica los guards de autenticación y permisos a todas las rutas
@Controller('role') // Define el prefijo de las rutas del controlador
export class RoleController {
  // Inyección de dependencias: se inyecta el servicio de roles
  constructor(private readonly roleService: RoleService) {}

  // Ruta POST para crear un nuevo rol
  @PermissionAccess(PERMISSION.ROLE) // Verifica que el usuario tenga el permiso necesario
  @Post()
  public async create(
    @Body() createRoleDto: CreateRoleDto, // Recibe los datos del rol en el cuerpo de la solicitud
  ): Promise<ResponseMessage> {
    return {
      statusCode: 201, // Código de estado HTTP para creación exitosa
      data: await this.roleService.create(createRoleDto), // Llama al servicio para crear el rol
    };
  }

  // Ruta GET para obtener una lista de roles con filtros opcionales
  @PermissionAccess(PERMISSION.ROLE, PERMISSION.ROLE_SHOW) // Verifica permisos para listar roles
  @ApiQuery({ name: 'limit', type: 'number', required: false }) // Parámetro opcional para limitar resultados
  @ApiQuery({ name: 'offset', type: 'number', required: false }) // Parámetro opcional para paginación
  @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false }) // Parámetro opcional para ordenar resultados
  @ApiQuery({ name: 'attr', type: 'string', required: false }) // Parámetro opcional para filtrar por atributo
  @ApiQuery({ name: 'value', type: 'string', required: false }) // Parámetro opcional para filtrar por valor
  @Get()
  async findAll(@Query() queryDto: QueryDto): Promise<ResponseMessage> {
    const { countData, data } = await this.roleService.findAll(queryDto); // Llama al servicio para obtener los roles
    return {
      statusCode: 200, // Código de estado HTTP para éxito
      countData, // Número total de resultados
      data, // Lista de roles
    };
  }

  // Ruta GET para obtener un rol específico por su ID
  @PermissionAccess(PERMISSION.ROLE, PERMISSION.ROLE_SHOW) // Verifica permisos para ver un rol
  @ApiParam({ name: 'id', type: 'string' }) // Documenta el parámetro 'id' en Swagger
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string, // Valida que el ID sea un UUID válido
  ): Promise<ResponseMessage> {
    return {
      statusCode: 200, // Código de estado HTTP para éxito
      data: await this.roleService.findOne(id), // Llama al servicio para obtener el rol
    };
  }

  // Ruta PATCH para actualizar un rol existente
  @PermissionAccess(PERMISSION.ROLE) // Verifica que el usuario tenga el permiso necesario
  @ApiParam({ name: 'id', type: 'string' }) // Documenta el parámetro 'id' en Swagger
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string, // Valida que el ID sea un UUID válido
    @Body() updateRoleDto: UpdateRoleDto, // Recibe los datos actualizados en el cuerpo de la solicitud
  ): Promise<ResponseMessage> {
    return {
      statusCode: 200, // Código de estado HTTP para éxito
      data: await this.roleService.update(id, updateRoleDto), // Llama al servicio para actualizar el rol
    };
  }

  // Ruta DELETE para eliminar un rol por su ID
  @PermissionAccess(PERMISSION.ROLE) // Verifica que el usuario tenga el permiso necesario
  @ApiParam({ name: 'id', type: 'string' }) // Documenta el parámetro 'id' en Swagger
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseMessage> {
    return this.roleService.remove(id); // Llama al servicio para eliminar el rol
  }
}
