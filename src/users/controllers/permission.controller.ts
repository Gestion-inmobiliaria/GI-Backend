// Importación de decoradores y módulos necesarios de NestJS
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

// Importación de DTOs, constantes, interfaces y servicios personalizados
import { QueryDto } from '../../common/dto/query.dto'; // DTO para manejar parámetros de consulta
import { ORDER_ENUM } from '../../common/constants'; // Enumeración para el orden de los datos
import { ResponseMessage } from '../../common/interfaces'; // Interfaz para estructurar las respuestas
import { PermissionService } from '../services/permission.service'; // Servicio que contiene la lógica de permisos
import { CreatePermissionDto } from '../dto/create-permission.dto'; // DTO para crear permisos
import { UpdatePermissionDto } from '../dto/update-permission.dto'; // DTO para actualizar permisos

// Importación de guards y decoradores personalizados
import { AuthGuard } from '../guards/auth.guard'; // Guard para manejar la autenticación
import { PermissionGuard } from '../guards/permission.guard'; // Guard para manejar permisos
import { PermissionAccess } from '../decorators/permissions.decorator'; // Decorador para verificar permisos
import { PERMISSION } from '../../users/constants/permission.constant'; // Constantes de permisos

// Decoradores de Swagger y configuración del controlador
@ApiTags('Permission') // Agrupa las rutas bajo la etiqueta 'Permission' en Swagger
@ApiBearerAuth() // Indica que las rutas requieren autenticación con un token Bearer
@UseGuards(AuthGuard, PermissionGuard) // Aplica los guards de autenticación y permisos a todas las rutas
@Controller('permission') // Define el prefijo de las rutas del controlador
export class PermissionController {
  // Inyección de dependencias: se inyecta el servicio de permisos
  constructor(private readonly permissionService: PermissionService) {}

  // Ruta POST para crear un nuevo permiso
  @PermissionAccess(PERMISSION.PERMISSION) // Verifica que el usuario tenga el permiso necesario
  @Post()
  async create(
    @Body() createPermissionDto: CreatePermissionDto, // Recibe los datos del permiso en el cuerpo de la solicitud
  ): Promise<ResponseMessage> {
    return {
      statusCode: 201, // Código de estado HTTP para creación exitosa
      data: await this.permissionService.create(createPermissionDto), // Llama al servicio para crear el permiso
    };
  }

  // Ruta GET para obtener una lista de permisos con filtros opcionales
  @PermissionAccess(PERMISSION.PERMISSION, PERMISSION.PERMISSION_SHOW) // Verifica permisos para listar
  @ApiQuery({ name: 'limit', type: 'number', required: false }) // Parámetro opcional para limitar resultados
  @ApiQuery({ name: 'offset', type: 'number', required: false }) // Parámetro opcional para paginación
  @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false }) // Parámetro opcional para ordenar resultados
  @ApiQuery({ name: 'attr', type: 'string', required: false }) // Parámetro opcional para filtrar por atributo
  @ApiQuery({ name: 'value', type: 'string', required: false }) // Parámetro opcional para filtrar por valor
  @Get()
  async findAll(@Query() queryDto: QueryDto): Promise<ResponseMessage> {
    const { data, countData } = await this.permissionService.findAll(queryDto); // Llama al servicio para obtener los permisos
    return {
      statusCode: 200, // Código de estado HTTP para éxito
      countData, // Número total de resultados
      data, // Lista de permisos
    };
  }

  // Ruta GET para obtener un permiso específico por su ID
  @PermissionAccess(PERMISSION.PERMISSION, PERMISSION.PERMISSION_SHOW) // Verifica permisos para ver un permiso
  @ApiParam({ name: 'id', type: 'string' }) // Documenta el parámetro 'id' en Swagger
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string, // Valida que el ID sea un UUID válido
  ): Promise<ResponseMessage> {
    return {
      statusCode: 200, // Código de estado HTTP para éxito
      data: await this.permissionService.findOne(id), // Llama al servicio para obtener el permiso
    };
  }

  // Ruta PATCH para actualizar un permiso existente
  @PermissionAccess(PERMISSION.PERMISSION) // Verifica que el usuario tenga el permiso necesario
  @ApiParam({ name: 'id', type: 'string' }) // Documenta el parámetro 'id' en Swagger
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string, // Valida que el ID sea un UUID válido
    @Body() updatePermissionDto: UpdatePermissionDto, // Recibe los datos actualizados en el cuerpo de la solicitud
  ): Promise<ResponseMessage> {
    return {
      statusCode: 200, // Código de estado HTTP para éxito
      data: await this.permissionService.update(id, updatePermissionDto), // Llama al servicio para actualizar el permiso
    };
  }

  // Ruta DELETE para eliminar un permiso por su ID
  @PermissionAccess(PERMISSION.PERMISSION) // Verifica que el usuario tenga el permiso necesario
  @ApiParam({ name: 'id', type: 'string' }) // Documenta el parámetro 'id' en Swagger
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseMessage> {
    return this.permissionService.remove(id); // Llama al servicio para eliminar el permiso
  }
}
