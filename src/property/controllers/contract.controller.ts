import { ContractService } from '../services/contract.service';
import { ContractEntity, Signature_Status } from '../entities/contract.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CreateContractDto, UpdateContractDto, CreateContractWithSignatureDto } from '@/property/dto';


@ApiTags('Contracts')
@Controller('contracts')
export class ContractController {
    constructor(private readonly contractService: ContractService) {}

    @Post()
    @ApiOperation({ 
        summary: 'Crear nuevo contrato',
        description: 'Crea un contrato tradicional sin proceso de firma digital' 
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Contrato creado exitosamente',
        type: ContractEntity 
    })
    create(@Body() createContractDto: CreateContractDto): Promise<ContractEntity> {
        console.log("BIENVENIDO AL POST");
        console.log('Payload recibido en POST /contracts:', createContractDto);
        return this.contractService.create(createContractDto);
    }

    @Post('with-signature')
    @ApiOperation({ 
        summary: 'Crear contrato con proceso de firma digital',
        description: 'Crea un contrato e inicia automáticamente el proceso de firma digital enviando invitaciones por email' 
    })
    @ApiResponse({ 
        status: 201, 
        description: 'Contrato creado e invitaciones de firma enviadas',
        schema: {
            type: 'object',
            properties: {
                contract: { type: 'object' },
                signatureProcess: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        tokens: {
                            type: 'object',
                            properties: {
                                client: { type: 'string' },
                                agent: { type: 'string' }
                            }
                        }
                    }
                }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    @ApiResponse({ status: 404, description: 'Propiedad o método de pago no encontrado' })
    async createWithSignature(@Body() createDto: CreateContractWithSignatureDto) {
        console.log("CREANDO CONTRATO CON PROCESO DE FIRMA");
        console.log('Payload recibido en POST /contracts/with-signature:', createDto);
        return await this.contractService.createWithSignature(createDto);
    }

    @Get()
    @ApiOperation({ 
        summary: 'Obtener todos los contratos',
        description: 'Retorna lista de todos los contratos con sus firmas asociadas' 
    })
    @ApiQuery({ 
        name: 'signatureStatus', 
        required: false, 
        enum: Signature_Status,
        description: 'Filtrar contratos por estado de firma' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Lista de contratos obtenida exitosamente',
        type: [ContractEntity] 
    })
    async findAll(@Query('signatureStatus') signatureStatus?: Signature_Status): Promise<ContractEntity[]> {
        if (signatureStatus) {
            return this.contractService.findBySignatureStatus(signatureStatus);
        }
        return this.contractService.findAll();
    }

    @Get('signature-statistics')
    @ApiOperation({ 
        summary: 'Obtener estadísticas de estado de firmas',
        description: 'Retorna estadísticas sobre el estado de firmas de todos los contratos' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Estadísticas obtenidas exitosamente',
        schema: {
            type: 'object',
            properties: {
                total: { type: 'number' },
                noSignatureRequired: { type: 'number' },
                pendingSignatures: { type: 'number' },
                partiallySigned: { type: 'number' },
                fullySigned: { type: 'number' },
                expired: { type: 'number' }
            }
        }
    })
    async getSignatureStatistics() {
        return await this.contractService.getSignatureStatistics();
    }

    @Get(':id')
    @ApiOperation({ 
        summary: 'Obtener contrato por ID',
        description: 'Retorna un contrato específico con sus firmas asociadas' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Contrato obtenido exitosamente',
        type: ContractEntity 
    })
    @ApiResponse({ status: 404, description: 'Contrato no encontrado' })
    findOne(@Param('id') id: string): Promise<ContractEntity> {
        return this.contractService.findOne(+id);
    }

    @Patch(':id')
    @ApiOperation({ 
        summary: 'Actualizar contrato',
        description: 'Actualiza los datos de un contrato existente' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Contrato actualizado exitosamente',
        type: ContractEntity 
    })
    @ApiResponse({ status: 404, description: 'Contrato no encontrado' })
    update(
        @Param('id') id: string,
        @Body() updateContractDto: UpdateContractDto,
    ): Promise<ContractEntity> {
        return this.contractService.update(+id, updateContractDto);
    }

    @Delete(':id')
    @ApiOperation({ 
        summary: 'Eliminar contrato',
        description: 'Elimina un contrato y todas sus firmas asociadas' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Contrato eliminado exitosamente' 
    })
    @ApiResponse({ status: 404, description: 'Contrato no encontrado' })
    remove(@Param('id') id: string): Promise<void> {
        return this.contractService.remove(+id);
    }
}