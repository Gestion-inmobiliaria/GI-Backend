import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { UserService } from 'src/users/services/users.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { IPayload } from '../interfaces/payload.interface';
import { IGenerateToken } from '../interfaces/generate-token.interface';
import { IUserToken } from '../interfaces/userToken.interface';
import { userToken } from '../utils/user-token.utils';
import { handlerError } from 'src/common/utils/handlerError.utils';
import { RoleService } from './role.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { CreateUserDto, RegisterUserDto } from '../dto/create-user.dto';
import { RealStateService } from '@/realstate/services/realstate.service';
import { SectorsService } from '@/sectors/sectors.service';
import { DataSource } from 'typeorm';
import { PermissionService } from './permission.service';
import { PERMISSION } from '../constants/permission.constant';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    private readonly userService: UserService,
    private readonly realStateService: RealStateService,
    private readonly sectorService: SectorsService,
    private readonly dataSources: DataSource,
    private readonly configService: ConfigService,
    private readonly roleService: RoleService,
    private readonly permissionService: PermissionService,
  ) { }

  public async login(email: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findOneBy({
        key: 'email',
        value: email,
      });
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!user || !isPasswordValid || !user.isActive)
        throw new NotFoundException('Usuario o contraseña incorrectos');
      return this.generateJWT(user);
    } catch (error) {
      handlerError(error, this.logger);
    }
  }
  public async checkToken(token: string): Promise<UserEntity> {
    try {
      const managerToken: IUserToken | string = userToken(token);
      if (typeof managerToken === 'string')
        throw new NotFoundException('Token invalido');
      if (managerToken.isExpired) throw new NotFoundException('Token expirado');
      const user = await this.userService.findOneAuth(managerToken.sub);
      return user;
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public async generateJWT(user: UserEntity): Promise<any> {
    const userLogged: UserEntity = await this.userService.findOne(user.id);
    const payload: IPayload = {
      sub: userLogged.id,
      role: userLogged.role.id,
    };
    const accessToken = this.singJWT({
      payload,
      secret: this.configService.get('JWT_AUTH'),
      expiresIn: 28800,
    });
    return {
      accessToken,
      User: userLogged,
    };
  }

  public async registerCustomer(dto: CreateCustomerDto): Promise<any> {
    try {
      const clienteRole = await this.roleService.findOneByName('Cliente');  //Debe existir un rol con nombre Cliente exactamente, para que asigne por default el rol usuario


      const userDto: CreateUserDto = {
        ...dto,
        role: clienteRole.id,
      };

      const user = await this.userService.create(userDto);
      return this.generateJWT(user);
    } catch (error) {
      handlerError(error, this.logger);
    }
  }

  public singJWT({ payload, secret, expiresIn }: IGenerateToken) {
    const options: jwt.SignOptions = { expiresIn: expiresIn as any };  // Fuerza a un tipo compatible
    return jwt.sign(payload, secret, options);
  }

  public async register(registerDto: RegisterUserDto): Promise<any> {
    try {
      const { nameRealState, ...res } = registerDto;
      const queryRunner = this.dataSources.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        let roleId: string;
        const findRole = await this.roleService.findOneBy({
          key: 'name',
          value: 'basic',
        });
        const findPermission = await this.permissionService.findOneByName(
          PERMISSION.SUBSCRIPTION
        )
        if (!findRole) {
          const role = await this.roleService.create({
            name: 'basic',
            permissions: [findPermission.id],
          });
          roleId = role.id;
        } else {
          roleId = findRole.id;
        }
        const newRealState = await this.realStateService.create({
          name: nameRealState,
          address: '',
          email: res.email,
        });
        const newSector = await this.sectorService.create({
          name: nameRealState,
          adress: '',
          phone: '',
          realStateId: newRealState.data.id,
        });
        const requestUser: CreateUserDto = {
          ...res,
          role: roleId,
          sector: newSector.id,
        };
        const user = await this.userService.create(requestUser);

        await queryRunner.manager.save(newRealState.data)
        await queryRunner.manager.save(newSector)
        await queryRunner.manager.save(user);
        await queryRunner.commitTransaction();
        return this.generateJWT(user);
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
}
