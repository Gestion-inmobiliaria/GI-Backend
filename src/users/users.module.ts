import { Module } from '@nestjs/common';
import { UserService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RoleEntity } from './entities/role.entity';
import { PermissionEntity } from './entities/permission.entity';
import { PermissionRoleEntity } from './entities/permission-role.entity';
import { ConfigModule } from '@nestjs/config';
import { PermissionRoleService } from './services/permission-role.service';
import { PermissionService } from './services/permission.service';
import { RoleService } from './services/role.service';
import { RoleController } from './controllers/role.controller';
import { PermissionController } from './controllers/permission.controller';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';



@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleEntity,
      PermissionEntity,
      PermissionRoleEntity,
      UserEntity,
    ]),
    ConfigModule,
  ],
  controllers: [
    AuthController,
    RoleController,
    PermissionController,
    UsersController,
  ],
  providers: [
    AuthService,
    RoleService,
    PermissionService,
    PermissionRoleService,
    UserService,
  ],
  exports: [
    AuthService,
    RoleService,
    PermissionService,
    PermissionRoleService,
    UserService,
    TypeOrmModule,
  ],
})
export class UsersModule {}
