import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto, UpdateUserDto } from '../dto';
import { UserEntity } from '../entities/user.entity';
import { QueryDto } from 'src/common/dto/query.dto';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { ResponseMessage, ResponseGet } from 'src/common/interfaces';
import { RoleService } from './role.service';
import { ROLE } from 'src/users/constants/role.constant';
import { BranchService } from 'src/branches/services/branch.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly roleService: RoleService,
    private readonly branchService: BranchService,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      const { password, role, branch, ...user } = createUserDto;
      const passwordEncrypted = await this.encryptPassword(password);
      const roleFound = await this.roleService.exists(role);
      
      const userCreate: any = {
        ...user,
        password: passwordEncrypted,
        role: roleFound,
      };
      
      if (branch) {
        const branchFound = await this.branchService.findOne(branch);
        userCreate.branch = branchFound;
      }
      
      const newUser = this.userRepository.create(userCreate);
      const result = await this.userRepository.save(newUser);
      
      // TypeORM a veces devuelve un array, así que aseguramos tener un objeto
      const userCreated = Array.isArray(result) ? result[0] : result;
      if (!userCreated || !userCreated.id) {
        throw new BadRequestException('Error al crear el usuario');
      }
      
      return await this.findOne(userCreated.id);
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findAll(queryDto: QueryDto): Promise<ResponseGet> {
    try {
      const { limit, offset, order, attr, value } = queryDto;
      const query = this.userRepository.createQueryBuilder('user');
      query.leftJoinAndSelect('user.role', 'role');
      query.leftJoinAndSelect('user.branch', 'branch');
      query.leftJoinAndSelect('role.permissions', 'permissions');
      query.leftJoinAndSelect('permissions.permission', 'permission');      
      query.andWhere('role.name != :role', { role: ROLE.ADMIN_SU });
      if (limit) query.take(limit);
      if (offset) query.skip(offset);
      if (order) query.orderBy('user.name', order.toLocaleUpperCase() as any);
      if (attr && value)
        query.andWhere(`user.${attr} ILIKE :value`, { value: `%${value}%` });

      return {
        data: await query.getMany(),
        countData: await query.getCount(),
      };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findOne(id: string): Promise<UserEntity> {
    try {
      const user: UserEntity = await this.userRepository.findOne({
        where: { id },
        relations: [
          'role',
          'branch',
          'role.permissions',
          'role.permissions.permission',          
        ],
      });
      if (!user) throw new NotFoundException('Usuario no encontrado.');
      return user;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findOneBy({
    key,
    value,
  }: {
    key: keyof CreateUserDto;
    value: any;
  }) {
    try {
      const user: UserEntity = await this.userRepository.findOne({
        where: { [key]: value, isActive: true },
        relations: [
          'role',
          'branch',
          'role.permissions',
          'role.permissions.permission',          
        ],
      });
      if (!user) throw new NotFoundException('Usuario no encontrado.');
      return user;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async findOneAuth(id: string): Promise<UserEntity> {
    try {
      const user: UserEntity = await this.userRepository.findOne({
        where: { id, isActive: true },
        relations: [
          'role',
          'branch',
          'role.permissions',
          'role.permissions.permission',          
        ],
      });
      if (!user) throw new UnauthorizedException('User not found.');
      return user;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    try {
      const { role, password, branch, ...userRest } = updateUserDto;
      const user: UserEntity = await this.findOne(id);
      let dataUserUpdated: Partial<UserEntity> = { ...userRest };
      
      if (password) {
        const passwordEncrypted = await this.encryptPassword(password);
        dataUserUpdated = { ...dataUserUpdated, password: passwordEncrypted };
      }
      
      if (role) {
        const roleFound = await this.roleService.findOne(role);
        dataUserUpdated = { ...dataUserUpdated, role: roleFound };
      }
      
      if (branch) {
        const branchFound = await this.branchService.findOne(branch);
        dataUserUpdated = { ...dataUserUpdated, branch: branchFound };
      }
      
      const userUpdated = await this.userRepository.update(
        user.id,
        dataUserUpdated,
      );
      
      if (userUpdated.affected === 0)
        throw new BadRequestException('Usuario no actualizado');
      
      return await this.findOne(id);
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async delete(id: string): Promise<ResponseMessage> {
    try {
      const user: UserEntity = await this.findOne(id);
      // no eliminar si es ADMIN_SU o si es el administrador de TI
      if (user.role.name === ROLE.ADMIN_SU)
        throw new UnauthorizedException('You cannot delete the super user');
      if (user.role.name === ROLE.ADMIN)
        throw new UnauthorizedException(
          'You cannot delete the administrator of IT',
        );
      const userDeleted = await this.userRepository.update(user.id, {
        isActive: false,
      });
      if (userDeleted.affected === 0)
        throw new BadRequestException('El usuario no se ha podido eliminar');
      return { statusCode: 200, message: 'Usuario desactivado' };
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  // other methods
  public async count(queryDto: QueryDto): Promise<number> {
    try {
      const { attr, value } = queryDto;
      const query = this.userRepository.createQueryBuilder('user');
      // TODO: Validar que el usuario no sea ADMIN_SU
      query.andWhere('role.name != :role', { role: ROLE.ADMIN_SU });
      if (attr && value)
        query.andWhere(`user.${attr} ILIKE :value`, { value: `%${value}%` });
      return await query.getCount();
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async encryptPassword(password: string): Promise<string> {
    return bcrypt.hashSync(password, +process.env.HASH_SALT);
  }
}
