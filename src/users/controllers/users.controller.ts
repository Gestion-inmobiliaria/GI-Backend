// Importación de decoradores y módulos necesarios de NestJS
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/users.service'; // Servicio que contiene la lógica de usuarios
import { CreateUserDto, UpdateUserDto } from '../dto'; // DTOs para crear y actualizar usuarios
import { ResponseMessage } from 'src/common/interfaces'; // Interfaz para estructurar las respuestas
import { QueryDto } from 'src/common/dto/query.dto'; // DTO para manejar parámetros de consulta
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'; // Decoradores para documentación con Swagger
import { AuthGuard } from '../guards/auth.guard'; // Guard para manejar la autenticación
import { PermissionGuard } from '../guards/permission.guard'; // Guard para manejar permisos
import { PermissionAccess } from '../decorators/permissions.decorator'; // Decorador para verificar permisos
import { PERMISSION } from 'src/users/constants/permission.constant'; // Constantes de permisos
import { ORDER_ENUM } from 'src/common/constants'; // Enumeración para el orden de los datos

// Decoradores de Swagger y configuración del controlador
@ApiTags('Users') // Agrupa las rutas bajo la etiqueta 'Users' en Swagger
@UseGuards(AuthGuard, PermissionGuard) // Aplica los guards de autenticación y permisos a todas las rutas
@ApiBearerAuth() // Indica que las rutas requieren autenticación con un token Bearer
@Controller('user') // Define el prefijo de las rutas del controlador
export class UsersController {
  // Inyección de dependencias: se inyecta el servicio de usuarios
  constructor(private readonly userService: UserService) {}

  // Ruta POST para crear un nuevo usuario
  @PermissionAccess(PERMISSION.USER) // Verifica que el usuario tenga el permiso necesario
  @Post()
  public async create(
    @Body() createUserDto: CreateUserDto, // Recibe los datos del usuario en el cuerpo de la solicitud
  ): Promise<ResponseMessage> {
    return {
      statusCode: 201, // Código de estado HTTP para creación exitosa
      data: await this.userService.create(createUserDto), // Llama al servicio para crear el usuario
    };
  }

  // Ruta GET para obtener una lista de usuarios con filtros opcionales
  @PermissionAccess(PERMISSION.USER, PERMISSION.USER_SHOW) // Verifica permisos para listar usuarios
  @ApiQuery({ name: 'limit', type: 'number', required: false }) // Parámetro opcional para limitar resultados
  @ApiQuery({ name: 'offset', type: 'number', required: false }) // Parámetro opcional para paginación
  @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false }) // Parámetro opcional para ordenar resultados
  @ApiQuery({ name: 'attr', type: 'string', required: false }) // Parámetro opcional para filtrar por atributo
  @ApiQuery({ name: 'value', type: 'string', required: false }) // Parámetro opcional para filtrar por valor
  @Get()
  public async findAll(@Query() queryDto: QueryDto): Promise<ResponseMessage> {
    const { countData, data } = await this.userService.findAll(queryDto); // Llama al servicio para obtener los usuarios
    return {
      statusCode: 200, // Código de estado HTTP para éxito
      data, // Lista de usuarios
      countData, // Número total de resultados
    };
  }

  // Ruta GET para obtener un usuario específico por su ID
  @PermissionAccess(PERMISSION.USER, PERMISSION.USER_SHOW) // Verifica permisos para ver un usuario
  @ApiParam({ name: 'userId', type: 'string' }) // Documenta el parámetro 'userId' en Swagger
  @Get(':userId')
  public async findOne(
    @Param('userId', ParseUUIDPipe) userId: string, // Valida que el ID sea un UUID válido
  ): Promise<ResponseMessage> {
    return {
      statusCode: 200, // Código de estado HTTP para éxito
      data: await this.userService.findOne(userId), // Llama al servicio para obtener el usuario
    };
  }

  // Ruta PATCH para actualizar un usuario existente
  @PermissionAccess(PERMISSION.USER) // Verifica que el usuario tenga el permiso necesario
  @ApiParam({ name: 'userId', type: 'string' }) // Documenta el parámetro 'userId' en Swagger
  @Patch(':userId')
  public async update(
    @Param('userId', ParseUUIDPipe) userId: string, // Valida que el ID sea un UUID válido
    @Body() updateUserDto: UpdateUserDto, // Recibe los datos actualizados en el cuerpo de la solicitud
  ): Promise<ResponseMessage> {
    return {
      statusCode: 200, // Código de estado HTTP para éxito
      data: await this.userService.update(userId, updateUserDto), // Llama al servicio para actualizar el usuario
    };
  }

  // Ruta DELETE para eliminar un usuario por su ID
  @PermissionAccess(PERMISSION.USER) // Verifica que el usuario tenga el permiso necesario
  @ApiParam({ name: 'userId', type: 'string' }) // Documenta el parámetro 'userId' en Swagger
  @Delete(':userId')
  public async remove(
    @Param('userId', ParseUUIDPipe) userId: string, // Valida que el ID sea un UUID válido
  ): Promise<ResponseMessage> {
    return await this.userService.delete(userId); // Llama al servicio para eliminar el usuario
  }
}
