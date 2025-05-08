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
import { CategoryService } from "@/state/services/category.service";
import { ModalityService } from "@/state/services/modality.service";
import { OwnerService } from "@/users/services/owner.service";
import { RealStateService } from "@/realstate/services/realstate.service";
import { SectorsService } from "@/sectors/sectors.service";
import { PropertyService } from "@/property/services/property.service";
import { UbicacionService } from "@/property/services/ubicacion.service";
import { ImagesService } from "@/property/services/image.service";
import { PropertyOwnerService } from "@/property/services/property_owner.service";
import { EstadoProperty } from "@/property/entities/property.entity";

@Injectable()
export class SeedService {
    private readonly logger = new Logger('SeederService');
    private administradorSU: any;
    private realstates: any[] = [];
    private sectores: any[] = [];
    private categorias: any[] = [];
    private modalidades: any[] = [];
    private propietarios: any[] = [];
    private usuarios: any[] = [];

    constructor(
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly permissionService: PermissionService,
        private readonly planService: PlanService,
        private readonly paymentMethodService: PaymentMethodService,
        private readonly categoryService: CategoryService,
        private readonly modalityService: ModalityService,
        private readonly ownerService: OwnerService,
        private readonly realStateService: RealStateService,
        private readonly sectorService: SectorsService,
        private readonly propertyService: PropertyService,
        private readonly ubicacionService: UbicacionService,
        private readonly imagenService: ImagesService,
        private readonly propertyOwnerService: PropertyOwnerService,
        private dataSource: DataSource
    ) { }

    public async runSeeders() {
        try {
            await this.createPermissionsAndRoles();
            await this.createUsersAndAssignRoles();
            await this.createPlans();
            await this.createPaymentMethods();
            await this.createCategories();
            await this.createModalities();
            await this.createOwners();
            await this.createRealStates();
            await this.createSectors();
            await this.createAgents();
            await this.createProperties();
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

        // subscription
        const subscription = await this.permissionService.create({
            name: PERMISSION.SUBSCRIPTION,
            description: 'permite gestionar suscripciones',
            type: PermissionType.USERS,
        });

        // owners
        const owners = await this.permissionService.create({
            name: PERMISSION.OWNER,
            description: 'permite gestionar propietarios',
            type: PermissionType.USERS,
        });
        const ownersShow = await this.permissionService.create({
            name: PERMISSION.OWNER_SHOW,
            description: 'permite ver propietarios',
            type: PermissionType.USERS,
        });
        const ownersCreate = await this.permissionService.create({
            name: PERMISSION.OWNER_CREATE,
            description: 'permite crear propietarios',
            type: PermissionType.USERS,
        });
        const ownersUpdate = await this.permissionService.create({
            name: PERMISSION.OWNER_UPDATE,
            description: 'permite actualizar propietarios',
            type: PermissionType.USERS,
        });
        const ownersDelete = await this.permissionService.create({
            name: PERMISSION.OWNER_DELETE,
            description: 'permite eliminar propietarios',
            type: PermissionType.USERS,
        });

        // categories
        const categories = await this.permissionService.create({
            name: PERMISSION.CATEGORY,
            description: 'permite gestionar categorías',
            type: PermissionType.USERS,
        });
        const categoriesShow = await this.permissionService.create({
            name: PERMISSION.CATEGORY_SHOW,
            description: 'permite ver categorías',
            type: PermissionType.USERS,
        });
        const categoriesCreate = await this.permissionService.create({
            name: PERMISSION.CATEGORY_CREATE,
            description: 'permite crear categorías',
            type: PermissionType.USERS,
        });
        const categoriesUpdate = await this.permissionService.create({
            name: PERMISSION.CATEGORY_UPDATE,
            description: 'permite actualizar categorías',
            type: PermissionType.USERS,
        });
        const categoriesDelete = await this.permissionService.create({
            name: PERMISSION.CATEGORY_DELETE,
            description: 'permite eliminar categorías',
            type: PermissionType.USERS,
        });

        // modalities
        const modalities = await this.permissionService.create({
            name: PERMISSION.MODALITY,
            description: 'Permite gestionar modalidades',
            type: PermissionType.USERS,
        });
        const modalitiesShow = await this.permissionService.create({
            name: PERMISSION.MODALITY_SHOW,
            description: 'Permite ver modalidades',
            type: PermissionType.USERS,
        });
        const modalitiesCreate = await this.permissionService.create({
            name: PERMISSION.MODALITY_CREATE,
            description: 'Permite crear modalidades',
            type: PermissionType.USERS,
        });
        const modalitiesUpdate = await this.permissionService.create({
            name: PERMISSION.MODALITY_UPDATE,
            description: 'Permite actualizar modalidades',
            type: PermissionType.USERS,
        });
        const modalitiesDelete = await this.permissionService.create({
            name: PERMISSION.MODALITY_DELETE,
            description: 'Permite eliminar modalidades',
            type: PermissionType.USERS,
        });

        // Añadir permisos de LOG después de modalidades
        const log = await this.permissionService.create({
            name: PERMISSION.LOG,
            description: 'Permite gestionar bitácora',
            type: PermissionType.USERS,
        });
        const logShow = await this.permissionService.create({
            name: PERMISSION.LOG_SHOW,
            description: 'Permite ver bitácora',
            type: PermissionType.USERS,
        });

        const permissionSU = [
            realstate.id,
            realstateShow.id,
            realstateCreate.id,
            realstateUpdate.id,
            realstateDelete.id,
            log.id,
            logShow.id
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
            owners.id,
            ownersShow.id,
            ownersCreate.id,
            ownersUpdate.id,
            ownersDelete.id,
            categories.id,
            categoriesShow.id,
            categoriesCreate.id,
            categoriesUpdate.id,
            categoriesDelete.id,
            modalities.id,
            modalitiesShow.id,
            modalitiesCreate.id,
            modalitiesUpdate.id,
            modalitiesDelete.id,
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

    private async createCategories() {
        try {
            const categorias = await this.categoryService.findAll();
            // if (categorias.length > 0) {
            //     this.logger.log('Ya existen categorías en la base de datos');
            //     this.categorias = categorias.data;
            //     return;
            // }

            const categoriasData = [
                {
                    name: 'Departamento',
                    isActive: true
                },
                {
                    name: 'Casa',
                    isActive: true
                },
                {
                    name: 'Terreno',
                    isActive: true
                }
            ];

            for (const categoria of categoriasData) {
                const newCategoria = await this.categoryService.create(categoria);
                this.categorias.push(newCategoria);
            }

            this.logger.log('Categorías creadas exitosamente');
            return this.categorias;
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Error al crear categorías');
        }
    }

    private async createModalities() {
        try {
            const modalidades = await this.modalityService.findAll();
            // if (modalidades.countData > 0) {
            //     this.logger.log('Ya existen modalidades en la base de datos');
            //     this.modalidades = modalidades.data;
            //     return;
            // }

            const modalidadesData = [
                {
                    name: 'Venta'
                },
                {
                    name: 'Alquiler'
                },
                {
                    name: 'Anticrético'
                }
            ];

            for (const modalidad of modalidadesData) {
                const newModalidad = await this.modalityService.create(modalidad);
                this.modalidades.push(newModalidad);
            }

            this.logger.log('Modalidades creadas exitosamente');
            return this.modalidades;
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Error al crear modalidades');
        }
    }

    private async createOwners() {
        try {
            const propietarios = await this.ownerService.findAll({});
            if (propietarios.countData > 0) {
                this.logger.log('Ya existen propietarios en la base de datos');
                this.propietarios = propietarios.data;
                return;
            }

            const propietariosData = [
                {
                    ci: '5678123',
                    name: 'Carlos Vargas',
                    email: 'cvargas@gmail.com',
                    phone: '76543210',
                    isActive: true,
                    property: []
                },
                {
                    ci: '7890123',
                    name: 'María López',
                    email: 'mlopez@gmail.com',
                    phone: '70123456',
                    isActive: true,
                    property: []
                },
                {
                    ci: '4567890',
                    name: 'Roberto Mendoza',
                    email: 'rmendoza@gmail.com',
                    phone: '71234567',
                    isActive: true,
                    property: []
                },
                {
                    ci: '3456789',
                    name: 'Laura Suárez',
                    email: 'lsuarez@gmail.com',
                    phone: '73456789',
                    isActive: true,
                    property: []
                },
                {
                    ci: '6789012',
                    name: 'Jorge Flores',
                    email: 'jflores@gmail.com',
                    phone: '78901234',
                    isActive: true,
                    property: []
                }
            ];

            for (const propietario of propietariosData) {
                const newPropietario = await this.ownerService.create(propietario);
                this.propietarios.push(newPropietario);
            }

            this.logger.log('Propietarios creados exitosamente');
            return this.propietarios;
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Error al crear propietarios');
        }
    }

    private async createRealStates() {
        try {
            if ((await this.realStateService.findAll({})).countData > 0) {
                this.logger.log('Ya existen inmobiliarias en la base de datos');
                const realstates = await this.realStateService.findAll({});
                this.realstates = realstates.data;
                return;
            }

            const inmobiliarias = [
                {
                    name: 'Century 21',
                    email: 'info@century21.com.bo',
                    address: 'Av. Ballivián #1234, Cochabamba'
                },
                {
                    name: 'Remax',
                    email: 'contacto@remax.com.bo',
                    address: 'Calle Sucre #567, Santa Cruz'
                }
            ];

            for (const inmobiliaria of inmobiliarias) {
                const newInmobiliaria = await this.realStateService.create(inmobiliaria);
                this.realstates.push(newInmobiliaria);
            }

            this.logger.log('Inmobiliarias creadas exitosamente');
            return this.realstates;
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Error al crear inmobiliarias');
        }
    }

    private async createSectors() {
        try {
            const sectores = await this.sectorService.findAll({});
            if (sectores.countData > 0) {
                this.logger.log('Ya existen sectores en la base de datos');
                this.sectores = sectores.data;
                return;
            }

            // Verificamos que tengamos las inmobiliarias cargadas
            if (this.realstates.length === 0) {
                const realstatesResponse = await this.realStateService.findAll({});
                this.realstates = realstatesResponse.data;
            }

            // Asegurarse de que tenemos las inmobiliarias
            if (this.realstates.length < 2) {
                throw new Error('No hay suficientes inmobiliarias para crear sectores');
            }

            // Century 21 sectores (inmobiliaria en posición 0)
            const sectoresCentury = [
                {
                    name: 'Zona Norte',
                    adress: 'Av. América #789, Cochabamba',
                    phone: '4245678',
                    realStateId: this.realstates[0].id
                },
                {
                    name: 'Zona Centro',
                    adress: 'Calle Jordán #456, Cochabamba',
                    phone: '4256789',
                    realStateId: this.realstates[0].id
                }
            ];

            // Remax sectores (inmobiliaria en posición 1)
            const sectoresRemax = [
                {
                    name: 'Centro',
                    adress: 'Av. Irala #321, Santa Cruz',
                    phone: '3345678',
                    realStateId: this.realstates[1].id
                },
                {
                    name: 'Equipetrol',
                    adress: 'Av. San Martín #987, Santa Cruz',
                    phone: '3356789',
                    realStateId: this.realstates[1].id
                }
            ];

            const todosSectores = [...sectoresCentury, ...sectoresRemax];

            for (const sector of todosSectores) {
                const newSector = await this.sectorService.create(sector);
                this.logger.log(`Sector creado: ${newSector.name} para inmobiliaria ID: ${sector.realStateId}`);
                this.sectores.push(newSector);
            }

            this.logger.log('Sectores creados exitosamente');
            return this.sectores;
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Error al crear sectores');
        }
    }

    private async createAgents() {
        try {
            // Verificamos si ya existen usuarios además del administrador
            const usuarios = await this.userService.findAll({});
            if (usuarios.countData > 1) {
                this.logger.log('Ya existen agentes en la base de datos');
                this.usuarios = usuarios.data.filter(user => user.role.name !== ROLE.ADMIN_SU);
                return;
            }

            // Obtenemos el rol de administrador
            const roles = await this.roleService.findAll({});
            const rolAdmin = roles.data.find(role => role.name === ROLE.ADMIN);

            if (!rolAdmin) {
                throw new Error('No se encontró el rol de administrador');
            }

            const agentes = [
                {
                    name: 'Juan Pérez',
                    email: 'jperez@century21.com.bo',
                    password: '12345678',
                    role: rolAdmin.id,
                    ci: 87654321,
                    phone: '76543219',
                    gender: GENDER.MALE,
                    sector: this.sectores[0].id // Sector Zona Norte de Century 21
                },
                {
                    name: 'Ana García',
                    email: 'agarcia@remax.com.bo',
                    password: '12345678',
                    role: rolAdmin.id,
                    ci: 76543210,
                    phone: '70123457',
                    gender: GENDER.FEMALE,
                    sector: this.sectores[2].id // Sector Centro de Remax
                }
            ];

            for (const agente of agentes) {
                const newAgente = await this.userService.create(agente);
                this.usuarios.push(newAgente);
            }

            this.logger.log('Agentes creados exitosamente');
            return this.usuarios;
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Error al crear agentes');
        }
    }

    private async createProperties() {
        try {
            // Verificar si ya existen propiedades
            const propiedadesResponse = await this.propertyService.findAll({});
            if (propiedadesResponse.countData > 0) {
                this.logger.log('Ya existen propiedades en la base de datos');
                return;
            }

            // Verificamos que tengamos las categorías, modalidades, sectores y usuarios cargados
            if (this.categorias.length === 0) {
                this.categorias = await this.categoryService.findAll();
                this.logger.log(`Categorías cargadas: ${this.categorias.length}`);
            }
            
            if (this.modalidades.length === 0) {
                this.modalidades = await this.modalityService.findAll();
                this.logger.log(`Modalidades cargadas: ${this.modalidades.length}`);
            }
            
            if (this.sectores.length === 0) {
                const sectoresResponse = await this.sectorService.findAll({});
                this.sectores = sectoresResponse.data;
                this.logger.log(`Sectores cargados: ${this.sectores.length}`);
            }
            
            if (this.usuarios.length === 0) {
                const usuariosResponse = await this.userService.findAll({});
                this.usuarios = usuariosResponse.data.filter(user => user.role.name !== ROLE.ADMIN_SU);
                this.logger.log(`Usuarios cargados: ${this.usuarios.length}`);
            }

            if (this.propietarios.length === 0) {
                const propietariosResponse = await this.ownerService.findAll({});
                this.propietarios = propietariosResponse.data;
                this.logger.log(`Propietarios cargados: ${this.propietarios.length}`);
            }

            // Datos de ubicaciones para las propiedades
            const ubicaciones = [
                {
                    direccion: 'Av. Villazón km 5, Sacaba',
                    pais: 'Bolivia',
                    ciudad: 'Cochabamba',
                    latitud: -17.398598,
                    longitud: -66.046665
                },
                {
                    direccion: 'Calle Bolívar #123, Cercado',
                    pais: 'Bolivia',
                    ciudad: 'Cochabamba',
                    latitud: -17.393688,
                    longitud: -66.157057
                },
                {
                    direccion: 'Av. América #456, Zona Norte',
                    pais: 'Bolivia',
                    ciudad: 'Cochabamba',
                    latitud: -17.367712,
                    longitud: -66.155740
                },
                {
                    direccion: 'Av. Santa Cruz #789, Cala Cala',
                    pais: 'Bolivia',
                    ciudad: 'Cochabamba',
                    latitud: -17.374826,
                    longitud: -66.143681
                },
                {
                    direccion: 'Av. Blanco Galindo km 2, Zona Oeste',
                    pais: 'Bolivia',
                    ciudad: 'Cochabamba',
                    latitud: -17.387556,
                    longitud: -66.189743
                },
                {
                    direccion: 'Av. Ballivián #234, Equipetrol',
                    pais: 'Bolivia',
                    ciudad: 'Santa Cruz',
                    latitud: -17.783057,
                    longitud: -63.180139
                },
                {
                    direccion: 'Calle Beni #567, Centro',
                    pais: 'Bolivia',
                    ciudad: 'Santa Cruz',
                    latitud: -17.784543,
                    longitud: -63.182367
                },
                {
                    direccion: 'Av. Irala #890, Centro',
                    pais: 'Bolivia',
                    ciudad: 'Santa Cruz',
                    latitud: -17.790765,
                    longitud: -63.178376
                },
                {
                    direccion: 'Av. San Martín #345, Las Palmas',
                    pais: 'Bolivia',
                    ciudad: 'Santa Cruz',
                    latitud: -17.778963,
                    longitud: -63.165844
                },
                {
                    direccion: 'Calle Los Jazmines #678, Equipetrol Norte',
                    pais: 'Bolivia',
                    ciudad: 'Santa Cruz',
                    latitud: -17.775421,
                    longitud: -63.183265
                }
            ];

            // Datos para propiedades
            const propiedadesData = [
                // Propiedades para Century 21 (Cochabamba)
                {
                    descripcion: 'Amplio departamento de 3 habitaciones con vista panorámica a la ciudad.',
                    precio: 95000,
                    estado: EstadoProperty.DISPONIBLE,
                    area: 120,
                    NroHabitaciones: 3,
                    NroBanos: 2,
                    NroEstacionamientos: 1,
                    category: this.categorias[0].id, // Departamento
                    modality: this.modalidades[0].id, // Venta
                    sector: this.sectores[0].id, // Zona Norte (Century 21)
                    user: this.usuarios[0].id,
                    propietario: this.propietarios[0].id,
                    ubicacion: ubicaciones[0]
                },
                {
                    descripcion: 'Casa de 2 plantas con jardín amplio y piscina en zona residencial.',
                    precio: 150000,
                    estado: EstadoProperty.DISPONIBLE,
                    area: 250,
                    NroHabitaciones: 4,
                    NroBanos: 3,
                    NroEstacionamientos: 2,
                    category: this.categorias[1].id, // Casa
                    modality: this.modalidades[0].id, // Venta
                    sector: this.sectores[0].id, // Zona Norte (Century 21)
                    user: this.usuarios[0].id,
                    propietario: this.propietarios[1].id,
                    ubicacion: ubicaciones[1]
                },
                {
                    descripcion: 'Departamento de lujo en edificio exclusivo, con acabados de primera.',
                    precio: 1200,
                    estado: EstadoProperty.DISPONIBLE,
                    area: 95,
                    NroHabitaciones: 2,
                    NroBanos: 2,
                    NroEstacionamientos: 1,
                    category: this.categorias[0].id, // Departamento
                    modality: this.modalidades[1].id, // Alquiler
                    sector: this.sectores[1].id, // Zona Centro (Century 21)
                    user: this.usuarios[0].id,
                    propietario: this.propietarios[2].id,
                    ubicacion: ubicaciones[2]
                },
                {
                    descripcion: 'Terreno de 500m² en zona de alto crecimiento, ideal para proyecto residencial.',
                    precio: 75000,
                    estado: EstadoProperty.DISPONIBLE,
                    area: 500,
                    NroHabitaciones: 0,
                    NroBanos: 0,
                    NroEstacionamientos: 0,
                    category: this.categorias[2].id, // Terreno
                    modality: this.modalidades[0].id, // Venta
                    sector: this.sectores[1].id, // Zona Centro (Century 21)
                    user: this.usuarios[0].id,
                    propietario: this.propietarios[3].id,
                    ubicacion: ubicaciones[3]
                },
                {
                    descripcion: 'Casa antigua con potencial para remodelar, excelente ubicación.',
                    precio: 85000,
                    estado: EstadoProperty.DISPONIBLE,
                    area: 180,
                    NroHabitaciones: 3,
                    NroBanos: 1,
                    NroEstacionamientos: 1,
                    category: this.categorias[1].id, // Casa
                    modality: this.modalidades[2].id, // Anticrético
                    sector: this.sectores[0].id, // Zona Norte (Century 21)
                    user: this.usuarios[0].id,
                    propietario: this.propietarios[4].id,
                    ubicacion: ubicaciones[4]
                },
                // Propiedades para Remax (Santa Cruz)
                {
                    descripcion: 'Departamento moderno en zona exclusiva con amenidades de primer nivel.',
                    precio: 110000,
                    estado: EstadoProperty.DISPONIBLE,
                    area: 135,
                    NroHabitaciones: 3,
                    NroBanos: 2,
                    NroEstacionamientos: 2,
                    category: this.categorias[0].id, // Departamento
                    modality: this.modalidades[0].id, // Venta
                    sector: this.sectores[2].id, // Centro (Remax)
                    user: this.usuarios[1].id,
                    propietario: this.propietarios[0].id,
                    ubicacion: ubicaciones[5]
                },
                {
                    descripcion: 'Casa de lujo en condominio cerrado con seguridad 24/7.',
                    precio: 200000,
                    estado: EstadoProperty.DISPONIBLE,
                    area: 350,
                    NroHabitaciones: 5,
                    NroBanos: 4,
                    NroEstacionamientos: 3,
                    category: this.categorias[1].id, // Casa
                    modality: this.modalidades[0].id, // Venta
                    sector: this.sectores[3].id, // Equipetrol (Remax)
                    user: this.usuarios[1].id,
                    propietario: this.propietarios[1].id,
                    ubicacion: ubicaciones[6]
                },
                {
                    descripcion: 'Departamento céntrico ideal para inversión, alta demanda de alquiler.',
                    precio: 1500,
                    estado: EstadoProperty.DISPONIBLE,
                    area: 90,
                    NroHabitaciones: 2,
                    NroBanos: 1,
                    NroEstacionamientos: 1,
                    category: this.categorias[0].id, // Departamento
                    modality: this.modalidades[1].id, // Alquiler
                    sector: this.sectores[2].id, // Centro (Remax)
                    user: this.usuarios[1].id,
                    propietario: this.propietarios[2].id,
                    ubicacion: ubicaciones[7]
                },
                {
                    descripcion: 'Terreno comercial estratégicamente ubicado, alto tráfico peatonal y vehicular.',
                    precio: 150000,
                    estado: EstadoProperty.DISPONIBLE,
                    area: 800,
                    NroHabitaciones: 0,
                    NroBanos: 0,
                    NroEstacionamientos: 0,
                    category: this.categorias[2].id, // Terreno
                    modality: this.modalidades[0].id, // Venta
                    sector: this.sectores[3].id, // Equipetrol (Remax)
                    user: this.usuarios[1].id,
                    propietario: this.propietarios[3].id,
                    ubicacion: ubicaciones[8]
                },
                {
                    descripcion: 'Penthouse de lujo con vista panorámica, terraza privada y jacuzzi.',
                    precio: 180000,
                    estado: EstadoProperty.DISPONIBLE,
                    area: 200,
                    NroHabitaciones: 3,
                    NroBanos: 3,
                    NroEstacionamientos: 2,
                    category: this.categorias[0].id, // Departamento
                    modality: this.modalidades[2].id, // Anticrético
                    sector: this.sectores[3].id, // Equipetrol (Remax)
                    user: this.usuarios[1].id,
                    propietario: this.propietarios[4].id,
                    ubicacion: ubicaciones[9]
                }
            ];

            // URLs de imágenes para las propiedades
            const imagenesData = [
                [
                    'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop'
                ],
                [
                    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop'
                ],
                [
                    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1560448204-603b3fc33bd5?w=800&auto=format&fit=crop'
                ],
                [
                    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=800&auto=format&fit=crop'
                ],
                [
                    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800&auto=format&fit=crop'
                ],
                [
                    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&auto=format&fit=crop'
                ],
                [
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop'
                ],
                [
                    'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop'
                ],
                [
                    'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1626082927389-6cd097cee6a6?w=800&auto=format&fit=crop'
                ],
                [
                    'https://images.unsplash.com/photo-1522156373667-4c7234bbd804?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&auto=format&fit=crop'
                ]
            ];

            // Crear propiedades una por una
            for (let i = 0; i < propiedadesData.length; i++) {
                const propiedadData = propiedadesData[i];
                
                this.logger.log(`Creando propiedad ${i+1}...`);
                
                // Desestructurar propiedadData para separar propietario
                const { propietario, ...propiedadDto } = propiedadData;
                
                // Crear la propiedad
                const propiedadResponse = await this.propertyService.create(propiedadDto);
                
                if (!propiedadResponse) {
                    throw new Error(`No se recibió respuesta al crear la propiedad ${i+1}`);
                }
                
                const propiedadId = propiedadResponse.data.id;
                this.logger.log(`Propiedad ${i+1} creada con ID: ${propiedadId}`);
                
                // Asignar propietario a la propiedad
                await this.propertyOwnerService.create({
                    property: propiedadId,
                    owner: propietario
                });
                this.logger.log(`Propietario asignado a la propiedad ${i+1}`);
                
                // Agregar imágenes a la propiedad
                const urlsImagenes = imagenesData[i];
                for (const url of urlsImagenes) {
                    await this.imagenService.create({
                        url,
                        propertyId: propiedadId
                    });
                }
                this.logger.log(`${urlsImagenes.length} imágenes agregadas a la propiedad ${i+1}`);
            }
            
            this.logger.log('Propiedades creadas exitosamente');
            return { message: 'Propiedades creadas exitosamente' };
        } catch (error) {
            handlerError(error, this.logger);
            throw new Error('Error al crear propiedades: ' + error.message);
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