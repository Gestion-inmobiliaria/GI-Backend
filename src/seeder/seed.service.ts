import { Injectable, Logger } from "@nestjs/common";

import { PERMISSION } from 'src/users/constants/permission.constant';
import { ROLE } from 'src/users/constants/role.constant';
import { CURRENCY, GENDER } from "src/common/constants";
import { CreateUserDto } from "src/users/dto";
import { PermissionType } from 'src/users/entities/permission.entity';

import { PermissionService } from "src/users/services/permission.service";
import { RoleService } from "src/users/services/role.service";
import { UserService } from "src/users/services/users.service";
import { handlerError } from "src/common/utils";
import { PlanService } from "@/realstate/services/plan.service";
import { PlanInterval } from "@/realstate/entities/plan.entity";
import { DataSource } from "typeorm";
import { PaymentMethodService } from "@/realstate/services/payment_method.service";
import { PAYMENTMETHOD } from "@/realstate/entities/payment_method.entity";

@Injectable()
export class SeedService {
    private readonly logger = new Logger('SeederService');
    private administradorSU: any;

    constructor(
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly permissionService: PermissionService,
        private readonly planService: PlanService,
        private readonly paymentMethodService: PaymentMethodService,
        private dataSource: DataSource
    ) { }

    public async runSeeders() {
        try {
            await this.createPermissionsAndRoles();
            await this.createUsersAndAssignRoles();
            await this.createPlans();
            await this.createPaymentMethods();
            return { message: 'Seeders ejecutados exitosamente' };
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Error al ejecutar seeders');
        }
    }

    private async createPermissionsAndRoles() {
        if ((await this.permissionService.findAll({})).countData > 0) {
            this.logger.log('Ya existen permisos en la base de datos');
            return;
        }
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
        // sectores
        const sectors = await this.permissionService.create({
            name: PERMISSION.SECTOR,
            description: 'permite gestionar sectores',
            type: PermissionType.USERS,
        });
        const sectorsShow = await this.permissionService.create({
            name: PERMISSION.SECTOR_SHOW,
            description: 'permite ver sectores',
            type: PermissionType.USERS,
        });
        const sectorsCreate = await this.permissionService.create({
            name: PERMISSION.SECTOR_CREATE,
            description: 'permite crear sectores',
            type: PermissionType.USERS,
        });
        const sectorsUpdate = await this.permissionService.create({
            name: PERMISSION.SECTOR_UPDATE,
            description: 'permite actualizar sectores',
            type: PermissionType.USERS,
        });
        // realstate
        const realstate = await this.permissionService.create({
            name: PERMISSION.REALSTATE,
            description: 'permite gestionar inmobiliarias',
            type: PermissionType.USERS,
        });
        const realstateShow = await this.permissionService.create({
            name: PERMISSION.REALSTATE_SHOW,
            description: 'permite ver inmobiliarias',
            type: PermissionType.USERS,
        });
        const realstateCreate = await this.permissionService.create({
            name: PERMISSION.REALSTATE_CREATE,
            description: 'permite crear inmobiliarias',
            type: PermissionType.USERS,
        });
        const realstateUpdate = await this.permissionService.create({
            name: PERMISSION.REALSTATE_UPDATE,
            description: 'permite actualizar inmobiliarias',
            type: PermissionType.USERS,
        });
        const realstateDelete = await this.permissionService.create({
            name: PERMISSION.REALSTATE_DELETE,
            description: 'permite eliminar inmobiliarias',
            type: PermissionType.USERS,
        });

        const subscription = await this.permissionService.create({
            name: PERMISSION.SUBSCRIPTION,
            description: 'permite gestionar suscripciones',
            type: PermissionType.USERS,
        });

        const branch = await this.permissionService.create({
            name: PERMISSION.BRANCH,
            description: 'permite gestionar sucursales',
            type: PermissionType.BRANCH,
        });

        const branchShow = await this.permissionService.create({
            name: PERMISSION.BRANCH_SHOW,
            description: 'permite ver sucursales',
            type: PermissionType.BRANCH,
        });

        const permissionSU = [          
            realstate.id,
            realstateShow.id,
            realstateCreate.id,
            realstateUpdate.id,
            realstateDelete.id,
        ];

        const permissionUser = [
            users.id,
            usersShow.id,
            roles.id,
            rolesShow.id,
            permissionsShow.id,
            sectors.id,
            sectorsShow.id,
            sectorsCreate.id,
            sectorsUpdate.id,
            realstate.id,
            realstateShow.id,
            realstateCreate.id,
            realstateUpdate.id,
            realstateDelete.id,
            subscription.id,
            branch.id,     // Añadir permisos de sucursales
            branchShow.id,
        ]

        this.administradorSU = await this.roleService.create({
            name: ROLE.ADMIN_SU,
            permissions: permissionSU,
        });

        await this.roleService.create({
            name: ROLE.ADMIN,
            permissions: permissionUser,
        })
    }

    private async createUsersAndAssignRoles() {
        try {
            if ((await this.userService.findAll({})).countData > 0) {
                this.logger.log('Ya existen usuarios en la base de datos');
                return;
            }
            const userSU: CreateUserDto = {
                name: 'Administrador SU',
                email: 'adminSU@gmail.com',
                password: '12345678',
                role: this.administradorSU.id,
                ci: 12345678,
                phone: '12345678',
                gender: GENDER.FEMALE
            };

            const user1 = await this.userService.create(userSU);

            return { user1 };

        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Error al crear usuarios');
        }
    }

    private async createPlans() {
        try {
            if ((await this.planService.findAll({})).countData > 0) {
                this.logger.log('Ya existen planes en la base de datos');
                return;
            }
            const basicPlan = await this.planService.create({
                name: 'Básico',
                description: 'Hasta 50 propiedades, 2 usuarios, Dashboard básico, Soporte por email',
                unit_amount: 0.50,
                currency: CURRENCY.USDT,
                contentHtml: "[\"1 agente\",\"1 sectores\",\"Hasta 20 inmuebles\",\"Dashboard básico\",\"Soporte por email\"]",
                interval: PlanInterval.month,
                amount_properties: 20,
                amount_users: 1,
                amount_sectors: 1,
            });
            const professionalPlan = await this.planService.create({
                name: 'Profesional',
                description: 'Hasta 200 propiedades, 5 usuarios, Dashboard avanzado, Reportes básicos, Soporte prioritario',
                unit_amount: 1,
                currency: CURRENCY.USDT,
                contentHtml: "[\"5 agentes\",\"3 sectores\",\"Hasta 100 inmuebles\",\"Dashboard avanzado\",\"Soporte por email\",\"Reportes básicos\"]",
                interval: PlanInterval.month,
                amount_properties: 100,
                amount_users: 5,
                amount_sectors: 3,
            });
            const businessPlan = await this.planService.create({
                name: 'Empresarial',
                description: 'Propiedades ilimitadas, Usuarios ilimitados, Dashboard personalizado, Reportes avanzados, API access, Soporte 24/7',
                unit_amount: 2,
                currency: CURRENCY.USDT,
                contentHtml: "[\"20 agentes\",\"10 sectores\",\"Hasta 500 inmuebles\",\"Dashboard Profesional\",\"Soporte por email\",\"Reportes avanzados\",\"Soporte 24/7\"]",
                interval: PlanInterval.month,
                amount_properties: 500,
                amount_users: 20,
                amount_sectors: 10,
            });

            return {
                basicPlan,
                professionalPlan,
                businessPlan,
            };
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    private async createPaymentMethods() {
        try {
            if ((await this.paymentMethodService.findAll({})).countData > 0) {
                this.logger.log('Ya existen metodos de pago en la base de datos');
                return;
            }
            const cash = await this.paymentMethodService.create(PAYMENTMETHOD.cash);
            const credit_card = await this.paymentMethodService.create(PAYMENTMETHOD.credit_card);
            const crypto = await this.paymentMethodService.create(PAYMENTMETHOD.crypto);
            const qrCode = await this.paymentMethodService.create(PAYMENTMETHOD.qr_code);

            return {
                cash,
                credit_card,
                crypto,
                qrCode,
            };
        } catch (error) {
            handlerError(error, this.logger);
        }
    }

    async resetDatabase() {
        await this.dataSource.dropDatabase();
        await this.dataSource.synchronize();

        return {
            message: 'Base de datos reiniciada exitosamente',
        }
    }
}