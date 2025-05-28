import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ContractType, ContractStatus, ContractFormat } from '@/property/entities/contract.entity';
import { IsString, IsNumber, IsDate, IsNotEmpty, IsEnum, IsEmail, IsOptional, IsUUID, IsBoolean } from 'class-validator';

export class CreateContractDto {
    @IsNumber()
    @IsNotEmpty()
    contractNumber: number;

    @IsEnum(ContractType)
    @IsNotEmpty()
    type: ContractType;

    @IsEnum(ContractStatus)
    @IsNotEmpty()
    status: ContractStatus;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @IsDate()
    @IsNotEmpty()
    startDate: Date;

    @IsDate()
    @IsNotEmpty()
    endDate: Date;

    @IsString()
    @IsNotEmpty()
    clientName: string;

    @IsString()
    @IsNotEmpty()
    clientDocument: string;

    @IsString()
    @IsOptional()
    clientPhone?: string;

    @IsEmail()
    @IsOptional()
    clientEmail?: string;

    @IsString()
    @IsNotEmpty()
    agentName: string;

    @IsString()
    @IsNotEmpty()
    agentDocument: string;

    @IsString()
    @IsNotEmpty()
    contractContent: string; // Base64 o HTML, contenido del contrato

    @IsEnum(ContractFormat)
    @IsNotEmpty()
    contractFormat: ContractFormat;

    @IsString()
    @IsOptional()
    notes?: string;

    @ApiProperty({
        description: 'ID de la propiedad asociada',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsNotEmpty()
    @IsUUID()
    propertyId: string;

    @ApiProperty({
        description: 'ID del método de pago utilizado',
        example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsNotEmpty()
    @IsUUID()
    paymentMethodId: string;

    // NUEVO CAMPO: Indica si el contrato requiere firmas digitales
    @ApiProperty({
        description: 'Indica si el contrato requiere proceso de firma digital',
        example: false,
        default: false
    })
    @IsBoolean()
    @IsOptional()
    requiresSignature?: boolean;

    // NUEVO CAMPO: Email del agente para firmas (si es diferente al del sistema)
    @ApiProperty({
        description: 'Email del agente para enviar invitación de firma (si es diferente)',
        example: 'agente@inmobiliaria.com'
    })
    @IsEmail()
    @IsOptional()
    agentEmail?: string;
}

export class UpdateContractDto extends PartialType(CreateContractDto) {}

// NUEVO DTO para crear contrato con firma
export class CreateContractWithSignatureDto extends CreateContractDto {
    @ApiProperty({
        description: 'Email del cliente para enviar invitación de firma',
        example: 'cliente@email.com'
    })
    @IsEmail()
    @IsNotEmpty()
    clientEmailForSignature: string;

    @ApiProperty({
        description: 'Email del agente para enviar invitación de firma',
        example: 'agente@inmobiliaria.com'
    })
    @IsEmail()
    @IsNotEmpty()
    agentEmailForSignature: string;
}