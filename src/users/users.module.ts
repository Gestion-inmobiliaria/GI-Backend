import { Global, Module } from '@nestjs/common';
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
import { RealstateModule } from '@/realstate/realstate.module';
import { SectorsModule } from '@/sectors/sectors.module';
import { OwnerEntity } from './entities/owner.entity';
import { OwnerController } from './controllers/owner.controller';
import { OwnerService } from './services/owner.service';
import { ClientEntity } from './entities/client.entity';
import { ClientService } from './services/client.service';
import { ClientController } from './controllers/client.controller';



@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([
            PermissionEntity,
            PermissionRoleEntity,
            RoleEntity,
            UserEntity,
            OwnerEntity,
            ClientEntity,
        ]),
        RealstateModule,
        SectorsModule,
        ConfigModule,
    ],
    controllers: [
        AuthController,
        PermissionController,
        RoleController,
        UsersController,
        OwnerController,
        ClientController,
    ],
    providers: [
        AuthService,
        PermissionService,
        PermissionRoleService,
        RoleService,
        UserService,
        OwnerService,
        ClientService,
    ],
    exports: [
        AuthService,
        PermissionService,
        PermissionRoleService,
        RoleService,
        UserService,
        ClientService,
        TypeOrmModule,
    ],
})

export class UsersModule {}
