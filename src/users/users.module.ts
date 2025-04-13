import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from './guards/auth.guard';
import { UserEntity } from './entities/user.entity';
import { RoleEntity } from './entities/role.entity';
import { RoleService } from './services/role.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/users.service';
import { PermissionGuard } from './guards/permission.guard';
import { GoogleStrategy } from './strategies/google.strategy';
import { RoleController } from './controllers/role.controller';
import { AuthController } from './controllers/auth.controller';
import { PermissionEntity } from './entities/permission.entity';
import { UsersController } from './controllers/users.controller';
import { PermissionService } from './services/permission.service';
import { PermissionRoleEntity } from './entities/permission-role.entity';
import { PermissionRoleService } from './services/permission-role.service';
import { PermissionController } from './controllers/permission.controller';



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
        UserService,
        RoleService,
        PermissionService,
        PermissionRoleService,
        AuthGuard,
        PermissionGuard,
        GoogleStrategy,
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
