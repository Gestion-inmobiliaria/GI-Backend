import { Injectable, Logger } from "@nestjs/common";

import { PERMISSION } from 'src/users/constants/permission.constant';
import { ROLE } from 'src/users/constants/role.constant';
import { GENDER } from "src/common/constants";
import { CreateUserDto } from "src/users/dto";
import { PermissionType } from 'src/users/entities/permission.entity';

import { PermissionService } from "src/users/services/permission.service";
import { RoleService } from "src/users/services/role.service";
import { UserService } from "src/users/services/users.service";
import { handlerError } from "src/common/utils";

@Injectable()
export class SeedService {
    private readonly logger = new Logger('SeederService');
    private administradorSU: any;

    constructor(
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly permissionService: PermissionService,        
    ) {}

    public async runSeeders() {
        try {
            await this.createPermissionsAndRoles();
            const { user1 } = await this.createUsersAndAssignRoles();
            return { message: 'Seeders ejecutados exitosamente' };
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Error al ejecutar seeders');
        }
    }
    
    private async createPermissionsAndRoles() {
        // user
        const users = await this.permissionService.create({
            name: PERMISSION.USER,
            description: 'permite gestionar usuarios',
            type: PermissionType.USERS,
        });
        const usersShow = await this.permissionService.create({
            name: PERMISSION.USER_SHOW,
            description: 'permite ver usuarios',
            type: PermissionType.USERS,
        });
        const roles = await this.permissionService.create({
            name: PERMISSION.ROLE,
            description: 'permite gestionar roles',
            type: PermissionType.USERS,
        });
        const rolesShow = await this.permissionService.create({
            name: PERMISSION.ROLE_SHOW,
            description: 'permite ver roles',
            type: PermissionType.USERS,
        });
        const permissions = await this.permissionService.create({
            name: PERMISSION.PERMISSION,
            description: 'permite gestionar permisos',
            type: PermissionType.USERS,
        });
        const permissionsShow = await this.permissionService.create({
            name: PERMISSION.PERMISSION_SHOW,
            description: 'permite ver permisos',
            type: PermissionType.USERS,
        });

        const permissionTI = [
            users.id,
            usersShow.id,
            roles.id,
            rolesShow.id,
            permissions.id,
            permissionsShow.id,
        ];
        
        this.administradorSU = await this.roleService.create({
            name: ROLE.ADMIN,            
            permissions: permissionTI,
        });        
    }

    private async createUsersAndAssignRoles() {
        try {
            const userSU: CreateUserDto = {
                name: 'Administrador SU',
                email: 'adminTI@gmail.com',
                password: '12345678',
                role: this.administradorSU.id,
                ci: 12345678,
                phone: '12345678',  
                gender: GENDER.FEMALE,
            };

            const user1 = await this.userService.create(userSU);

            return { user1 };

        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Error al crear usuarios');
        }
    }
}