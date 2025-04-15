import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResponseMessage } from '../../common/interfaces';
import { PermissionRoleEntity } from '../entities/permission-role.entity';
import { PermissionService } from './permission.service';
import { CreatePermissionRoleDto } from '../dto/create-permission-role.dto';
import { handlerError } from 'src/common/utils/handlerError.utils';

@Injectable()
export class PermissionRoleService {

  private readonly logger = new Logger('PermissionRoleService');

  constructor(
    @InjectRepository(PermissionRoleEntity) private readonly permissionRoleRepository: Repository<PermissionRoleEntity>,
    private readonly permissionService: PermissionService
  ) { }

  public async create(createPermissionRoleDto: CreatePermissionRoleDto): Promise<PermissionRoleEntity> {
    try {
      const { permission, role } = createPermissionRoleDto;
      const permisoEntity = await this.permissionService.findOne(permission);
      if (!permisoEntity) throw new NotFoundException('Permission not found');
      const permissionRoleCreated = this.permissionRoleRepository.create({ permission: { id: permission }, role: { id: role } });
      this.permissionRoleRepository.save(permissionRoleCreated);
      return permissionRoleCreated;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async remove(id: string): Promise<ResponseMessage> {
    try {
      const permissionRole = await this.permissionRoleRepository.findOne({ where: { id } });
      if (!permissionRole) throw new NotFoundException('permission-role not found');
      const permissionRoleDeleted = await this.permissionRoleRepository.delete(permissionRole);
      if (permissionRoleDeleted.affected === 0) throw new Error('Error deleting permission-role');
      return {
        message: 'Permission-role deleted successfully',
        statusCode: 200
      };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async getPermissionsByRole(roleId: string): Promise<PermissionRoleEntity[]> {
    try {
      const query = this.permissionRoleRepository.createQueryBuilder('permissionRole')
        .leftJoinAndSelect('permissionRole.permission', 'permission')
        .where('permissionRole.role.id = :roleId', { roleId });
      return await query.getMany();
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async clear(): Promise<void> {
    try {
      await this.permissionRoleRepository.clear();
    } catch (error) {
      handlerError(error, this.logger);
    }
  }
}
