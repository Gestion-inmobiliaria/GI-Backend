import { DataSource, Repository } from 'typeorm';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { RoleEntity } from '../entities/role.entity';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { QueryDto } from 'src/common/dto/query.dto';
import { ResponseGet, ResponseMessage } from 'src/common/interfaces';
import { ORDER_ENUM } from 'src/common/constants';
import { ROLE } from '../../users/constants/role.constant';
import { UpdateRoleDto, CreateRoleDto } from '../dto';
import { PermissionRoleEntity } from '../entities/permission-role.entity';
import { PermissionEntity } from '../entities/permission.entity';

@Injectable()
export class RoleService {
  private readonly logger = new Logger('RoleService');

  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(PermissionRoleEntity)
    private readonly permissionRoleRepository: Repository<PermissionRoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
    private readonly dataSources: DataSource,
  ) { }

  public async create(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    try {
      const { name, permissions } = createRoleDto;
      const queryRunner = this.dataSources.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const roleCreated = this.roleRepository.create({ name });
        await queryRunner.manager.save(roleCreated);

        const promises = permissions.map((permiso) => {
          const permissionFind = this.permissionRepository.findOne({
            where: { id: permiso },
          });
          if (!permissionFind)
            throw new NotFoundException('Permission not found');
          const permissionRole = this.permissionRoleRepository.create({
            role: { id: roleCreated.id },
            permission: { id: permiso },
          });
          return queryRunner.manager.save(permissionRole);
        });

        await Promise.all(promises);
        await queryRunner.commitTransaction();

        return roleCreated;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw new InternalServerErrorException(error.message);
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findAll(queryDto: QueryDto): Promise<ResponseGet> {
    try {
      const { limit, attr, value, offset, order = ORDER_ENUM.DESC } = queryDto;
      const query = this.roleRepository.createQueryBuilder('role');      
      query.where('role.name != :role', { role: ROLE.ADMIN_SU })
        .andWhere('role.name != :role2', { role2: 'basic' });
      if (attr && value)
        query.andWhere(`role.${attr} LIKE :value`, { value: `%${value}%` });
      if (limit) query.take(limit);
      if (offset) query.skip(offset);
      if (order) query.orderBy('role.name', order.toLocaleUpperCase() as any);
      return {
        data: await query.getMany(),
        countData: await query.getCount(),
      };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findOne(id: string): Promise<RoleEntity> {
    try {
      return await this.roleRepository.findOne({
        where: { id },
        relations: ['permissions', 'permissions.permission'],
      });
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findOneBy({ key, value }: { key: keyof CreateRoleDto; value: any }) {
    try {
      return await this.roleRepository.findOne({ where: { [key]: value } });
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleEntity> {
    try {
      const role = await this.roleRepository.findOne({ where: { id } });
      if (!role) throw new NotFoundException('Role not found');
      if (role.name === ROLE.ADMIN_SU || role.name === ROLE.ADMIN || role.name === 'basic')
        throw new ConflictException('El rol no puede ser modificado');
      const { name, permissions } = updateRoleDto;

      const queryRunner = this.dataSources.createQueryRunner(); // Inicializa la transacción
      await queryRunner.connect(); // Conecta con la base de datos
      await queryRunner.startTransaction();
      try {
        // Elimina los permisos asociados al rol
        queryRunner.manager.delete(PermissionRoleEntity, { role: { id: role.id } });

        // Actualiza el nombre del rol
        if (name) queryRunner.manager.update(RoleEntity, { id: role.id }, { name });

        // Asocia los nuevos permisos al rol
        const promises = permissions.map((permiso) => {
          const permissionFind = this.permissionRepository.findOne({ where: { id: permiso } });
          if (!permissionFind) throw new NotFoundException('Permission not found');
          const permissionRole = this.permissionRoleRepository.create({
            role: { id: role.id }, permission: { id: permiso }
          });
          return queryRunner.manager.save(permissionRole);
        });

        // resuelve todas las promesas
        await Promise.all(promises);
        await queryRunner.commitTransaction();
        return await this.findOne(id);
      } catch (error) {
        await queryRunner.rollbackTransaction(); // Deshace la transacción
        throw new InternalServerErrorException(error.message);
      } finally {
        await queryRunner.release();
      }
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async exists(id: string): Promise<RoleEntity> {
    try {
      return await this.roleRepository.findOne({ where: { id } });
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findOneByName(name: string): Promise<RoleEntity> {
    try {
      const role = await this.roleRepository.findOne({ where: { name } });
      if (!role) {
        throw new NotFoundException(`El rol "${name}" no existe`);
      }
      return role;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async remove(id: string): Promise<ResponseMessage> {
    try {
      const role = await this.roleRepository.findOne({
        where: { id },
        relations: ['permissions'],
      });

      if (!role) throw new NotFoundException('El rol no existe');

      if (role.name === ROLE.ADMIN_SU || role.name === ROLE.ADMIN)
        throw new ConflictException('El rol no puede ser eliminado');

      const permissionRoleDeleted = await this.permissionRoleRepository.delete({
        role: { id: role.id },
      });
      if (permissionRoleDeleted.affected === 0)
        throw new Error('Error al eliminar los permisos asociados al rol');
      const roleDeleted = await this.roleRepository.delete(role.id);
      if (roleDeleted.affected === 0)
        throw new Error('Error al eliminar el rol');
      return {
        message: 'Rol eliminado correctamente.',
        statusCode: 200,
      };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async clear(): Promise<void> {
    try {
      await this.roleRepository.clear();
    } catch (error) {
      handlerError(error, this.logger);
    }
  }
}
