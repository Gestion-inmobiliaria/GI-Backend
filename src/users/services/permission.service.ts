import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QueryDto } from '../../common/dto/query.dto';
import { ResponseGet, ResponseMessage } from '../../common/interfaces';
import { ORDER_ENUM } from '../../common/constants';
import { PermissionEntity } from '../entities/permission.entity';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { PERMISSION } from '../../users/constants/permission.constant';
import { UpdatePermissionDto } from '../dto/update-permission.dto';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger('PermissionService');

  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) { }

  public async create(
    createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionEntity> {
    try {
      const { name, description, type } = createPermissionDto;
      const permission = this.permissionRepository.create({ name, description, type });
      const permissionCreated =
        await this.permissionRepository.save(permission);
      return permissionCreated;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findAll(queryDto: QueryDto): Promise<ResponseGet> {
    try {
      const { limit, attr, value, offset, order = ORDER_ENUM.DESC } = queryDto;
      const query = this.permissionRepository.createQueryBuilder('permission');
      query.andWhere('permission.name != :permission', { permission: PERMISSION.PERMISSION });
      if (attr && value)
        query.andWhere(`permission.${attr} ILIKE :value`, { value: `%${value}%` });
      if (limit) query.take(limit);
      if (offset) query.skip(offset);
      if (order)
        query.orderBy('permission.name', order.toLocaleUpperCase() as any);
      return {
        data: await query.getMany(),
        countData: await query.getCount(),
      };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findOne(id: string): Promise<PermissionEntity> {
    try {
      return await this.permissionRepository.findOne({ where: { id } });
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findOneByName(name: string): Promise<PermissionEntity> {
    try {
      return await this.permissionRepository.findOne({ where: { name } });
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<PermissionEntity> {
    try {
      const permission = await this.permissionRepository.findOne({ where: { id } });
      if (!permission) throw new NotFoundException('Permission not found');
      const { name, description, type } = updatePermissionDto;
      const roleUpdated = await this.permissionRepository.update(permission, { name, description, type });
      if (!roleUpdated) throw new Error('Error updating permission');
      return permission;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async remove(id: string): Promise<ResponseMessage> {
    try {
      const permission = await this.permissionRepository.findOne({ where: { id } });
      if (!permission) throw new NotFoundException('permission not found');
      const permissionDeleted =
        await this.permissionRepository.delete(permission);
      if (permissionDeleted.affected === 0)
        throw new Error('Error deleting permission');
      return {
        message: 'Permission deleted successfully',
        statusCode: 200,
      };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async clear(): Promise<void> {
    try {
      await this.permissionRepository.clear();
    } catch (error) {
      handlerError(error, this.logger);
    }
  }
}
