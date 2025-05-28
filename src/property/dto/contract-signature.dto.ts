import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitiateSignatureDto {
    @ApiProperty({
        description: 'Email del cliente para enviar invitación de firma',
        example: 'cliente@email.com'
    })
    @IsString()
    @IsNotEmpty()
    clientEmail: string;

    @ApiProperty({
        description: 'Email del agente para enviar invitación de firma',
        example: 'agente@inmobiliaria.com'
    })
    @IsString()
    @IsNotEmpty()
    agentEmail: string;
}

export class VerifySignatureTokenDto {
    @ApiProperty({
        description: 'Token único de firma enviado por email',
        example: 'abc123-def456-ghi789'
    })
    @IsString()
    @IsNotEmpty()
    token: string;
}

export class SignContractDto {
    @ApiProperty({
        description: 'Token único de firma',
        example: 'abc123-def456-ghi789'
    })
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty({
        description: 'Imagen de la firma en formato Base64',
        example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...'
    })
    @IsString()
    @IsNotEmpty()
    signatureImage: string;

    @ApiProperty({
        description: 'Documento de identidad para verificación',
        example: '12345678'
    })
    @IsString()
    @IsNotEmpty()
    documentVerification: string;

    @ApiProperty({
        description: 'Dirección IP del firmante (se puede obtener automáticamente)',
        example: '192.168.1.1'
    })
    @IsString()
    @IsOptional()
    ipAddress?: string;

    @ApiProperty({
        description: 'User Agent del navegador (se puede obtener automáticamente)',
        example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    })
    @IsString()
    @IsOptional()
    userAgent?: string;
}

export class SignatureStatusResponseDto {
    @ApiProperty({ description: 'Estado general de firmas del contrato' })
    signatureStatus: string;

    @ApiProperty({ description: 'Información detallada de cada firma' })
    signatures: {
        signerType: string;
        signerName: string;
        status: string;
        signedAt?: Date;
    }[];

    @ApiProperty({ description: 'Indica si el contrato está completamente firmado' })
    isFullySigned: boolean;

    @ApiProperty({ description: 'Fecha de inicio del proceso de firma' })
    signatureStartedAt?: Date;
}