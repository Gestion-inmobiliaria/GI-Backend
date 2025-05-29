import { Controller, Post, Get, Body, Param, Req, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ContractSignatureService } from '../services/contract-signature.service';
import { 
    InitiateSignatureDto, 
    SignContractDto, 
    VerifySignatureTokenDto, 
    SignatureStatusResponseDto 
} from '../dto/contract-signature.dto';
import { SignerType } from '../entities/contract-signature.entity';
import { Request } from 'express';


@ApiTags('Contract Signatures')
@Controller('contracts')
export class ContractSignatureController {
    constructor(
        private readonly contractSignatureService: ContractSignatureService
    ) {}

    @Post(':id/initiate-signatures')
    @ApiOperation({ 
        summary: 'Iniciar proceso de firma digital para un contrato',
        description: 'Crea tokens únicos para cliente y agente, y envía invitaciones por email' 
    })
    @ApiParam({ name: 'id', description: 'ID del contrato' })
    @ApiResponse({ 
        status: 201, 
        description: 'Proceso de firma iniciado exitosamente',
        schema: {
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
    })
    @ApiResponse({ status: 404, description: 'Contrato no encontrado' })
    @ApiResponse({ status: 400, description: 'El contrato ya tiene un proceso de firma iniciado' })
    async initiateSignatureProcess(
        @Param('id') contractId: string,
        @Body() initiateDto: InitiateSignatureDto
    ) {
        console.log("BIENVENIDO A initiate-signatures");
        console.log('Payload recibido en POST /initiate-signatures:', InitiateSignatureDto);
        return await this.contractSignatureService.initiateSignatureProcess(contractId, initiateDto);
    }

    @Get(':id/signature-status')
    @ApiOperation({ 
        summary: 'Obtener estado de firmas de un contrato',
        description: 'Retorna el estado actual del proceso de firma digital' 
    })
    @ApiParam({ name: 'id', description: 'ID del contrato' })
    @ApiResponse({ 
        status: 200, 
        description: 'Estado de firmas obtenido exitosamente',
        type: SignatureStatusResponseDto
    })
    @ApiResponse({ status: 404, description: 'Contrato no encontrado' })
    async getSignatureStatus(@Param('id') contractId: string): Promise<SignatureStatusResponseDto> {
        return await this.contractSignatureService.getSignatureStatus(contractId);
    }

    @Post(':id/resend-invitation/:signerType')
    @ApiOperation({ 
        summary: 'Reenviar invitación de firma',
        description: 'Reenvía el email de invitación para firma a cliente o agente' 
    })
    @ApiParam({ name: 'id', description: 'ID del contrato' })
    @ApiParam({ 
        name: 'signerType', 
        description: 'Tipo de firmante (CLIENT o AGENT)',
        enum: SignerType
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Invitación reenviada exitosamente',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        }
    })
    @ApiResponse({ status: 404, description: 'Contrato o firma pendiente no encontrada' })
    async resendSignatureInvitation(
        @Param('id') contractId: string,
        @Param('signerType') signerType: SignerType
    ) {
        return await this.contractSignatureService.resendSignatureInvitation(contractId, signerType);
    }
}

@ApiTags('Signature Process')
@Controller('signature')
export class SignatureController {
    constructor(
        private readonly contractSignatureService: ContractSignatureService
    ) {}

    @Get('verify/:token')
    @ApiOperation({ 
        summary: 'Verificar token de firma y obtener datos del contrato',
        description: 'Valida el token de firma y retorna los datos necesarios para el proceso de firma' 
    })
    @ApiParam({ name: 'token', description: 'Token único de firma enviado por email' })
    @ApiResponse({ 
        status: 200, 
        description: 'Token verificado exitosamente',
        schema: {
            type: 'object',
            properties: {
                isValid: { type: 'boolean' },
                contract: { type: 'object' },
                signerInfo: {
                    type: 'object',
                    properties: {
                        signerType: { type: 'string' },
                        signerName: { type: 'string' },
                        signerDocument: { type: 'string' }
                    }
                },
                errorMessage: { type: 'string' }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Token inválido o expirado' })
    async verifySignatureToken(@Param('token') token: string) {
        const verification = await this.contractSignatureService.verifySignatureToken(token);
        
        if (!verification.isValid) {
            throw new BadRequestException(verification.errorMessage);
        }

        return {
            isValid: verification.isValid,
            contract: verification.contract,
            signerInfo: {
                signerType: verification.signature.signerType,
                signerName: verification.signature.signerName,
                signerDocument: verification.signature.signerDocument
            }
        };
    }

    @Post('sign')
    @ApiOperation({ 
        summary: 'Firmar contrato digitalmente',
        description: 'Registra la firma digital del usuario y actualiza el estado del contrato' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Contrato firmado exitosamente',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                contractStatus: { type: 'string' }
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Token inválido o datos incorrectos' })
    @ApiResponse({ status: 403, description: 'Documento de identidad no coincide' })
    async signContract(@Body() signDto: SignContractDto, @Req() request: Request) {
        // Obtener IP y User Agent automáticamente si no se proporcionan
        const ipAddress = signDto.ipAddress || 
                         request.ip || 
                         request.connection.remoteAddress || 
                         request.headers['x-forwarded-for'] as string || 
                         'Unknown';
        
        const userAgent = signDto.userAgent || request.headers['user-agent'] || 'Unknown';

        const enhancedSignDto = {
            ...signDto,
            ipAddress: ipAddress.toString(),
            userAgent
        };
        console.log("BIENVENIDO A SIGN CONTRACT");
        console.log('Payload recibido en POST /initiate-signatures:', SignContractDto);
        return await this.contractSignatureService.signContract(enhancedSignDto);
    }
}