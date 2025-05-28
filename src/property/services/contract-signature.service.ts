import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from '@/providers/email/email.service';
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ContractEntity, SignatureStatus as ContractSignatureStatus } from '../entities/contract.entity';
import { ContractSignatureEntity, SignerType, SignatureStatus } from '../entities/contract-signature.entity';
import { InitiateSignatureDto, SignContractDto, SignatureStatusResponseDto } from '../dto/contract-signature.dto';


@Injectable()
export class ContractSignatureService {
    constructor(
        @InjectRepository(ContractEntity)
        private readonly contractRepository: Repository<ContractEntity>,
        @InjectRepository(ContractSignatureEntity)
        private readonly signatureRepository: Repository<ContractSignatureEntity>,
        private readonly emailService: EmailService,
    ) {}

    async initiateSignatureProcess(contractId: string, initiateDto: InitiateSignatureDto): Promise<{ message: string; tokens: { client: string; agent: string } }> {
        const contract = await this.contractRepository.findOne({
            where: { id: contractId },
            relations: ['signatures', 'property']
        });

        if (!contract) {
            throw new NotFoundException('Contrato no encontrado');
        }

        // Verificar que el contrato no esté ya en proceso de firma
        if (contract.signatureStatus !== ContractSignatureStatus.NO_REQUIRED) {
            throw new BadRequestException('El contrato ya tiene un proceso de firma iniciado');
        }

        // Crear tokens únicos para cliente y agente
        const clientToken = this.generateSignatureToken();
        const agentToken = this.generateSignatureToken();
        const tokenExpiration = new Date();
        tokenExpiration.setDate(tokenExpiration.getDate() + 7); // 7 días de validez

        // Crear registros de firma para cliente
        const clientSignature = this.signatureRepository.create({
            contract,
            signerType: SignerType.CLIENT,
            signerName: contract.clientName,
            signerDocument: contract.clientDocument,
            signatureToken: clientToken,
            tokenExpiration,
            status: SignatureStatus.PENDING,
        });

        // Crear registros de firma para agente
        const agentSignature = this.signatureRepository.create({
            contract,
            signerType: SignerType.AGENT,
            signerName: contract.agentName,
            signerDocument: contract.agentDocument,
            signatureToken: agentToken,
            tokenExpiration,
            status: SignatureStatus.PENDING,
        });

        // Guardar las firmas
        await this.signatureRepository.save([clientSignature, agentSignature]);

        // Actualizar estado del contrato
        contract.signatureStatus = ContractSignatureStatus.PENDING_SIGNATURES;
        contract.signatureStartedAt = new Date();
        await this.contractRepository.save(contract);

        // Enviar emails de invitación
        await this.sendSignatureInvitations(contract, clientToken, agentToken, initiateDto);

        return {
            message: 'Proceso de firma iniciado exitosamente. Se han enviado las invitaciones por email.',
            tokens: { client: clientToken, agent: agentToken }
        };
    }

    async verifySignatureToken(token: string): Promise<{ 
        contract: ContractEntity; 
        signature: ContractSignatureEntity; 
        isValid: boolean;
        errorMessage?: string;
    }> {
        const signature = await this.signatureRepository.findOne({
            where: { signatureToken: token },
            relations: ['contract', 'contract.property', 'contract.payment_method']
        });

        if (!signature) {
            return { 
                contract: null, 
                signature: null, 
                isValid: false, 
                errorMessage: 'Token de firma no válido' 
            };
        }

        // Verificar expiración
        if (new Date() > signature.tokenExpiration) {
            signature.status = SignatureStatus.EXPIRED;
            await this.signatureRepository.save(signature);
            
            return { 
                contract: signature.contract, 
                signature, 
                isValid: false, 
                errorMessage: 'El token de firma ha expirado' 
            };
        }

        // Verificar si ya fue firmado
        if (signature.status === SignatureStatus.SIGNED) {
            return { 
                contract: signature.contract, 
                signature, 
                isValid: false, 
                errorMessage: 'Este contrato ya ha sido firmado por esta parte' 
            };
        }

        return { 
            contract: signature.contract, 
            signature, 
            isValid: true 
        };
    }

    async signContract(signDto: SignContractDto): Promise<{ message: string; contractStatus: string }> {
        const { contract, signature, isValid, errorMessage } = await this.verifySignatureToken(signDto.token);
        
        if (!isValid) {
            throw new BadRequestException(errorMessage);
        }

        // Verificar documento de identidad
        if (signature.signerDocument !== signDto.documentVerification) {
            throw new ForbiddenException('El documento de identidad no coincide con el registrado en el contrato');
        }

        // Guardar la firma
        signature.signatureImage = signDto.signatureImage;
        signature.signedAt = new Date();
        signature.status = SignatureStatus.SIGNED;
        signature.ipAddress = signDto.ipAddress;
        signature.userAgent = signDto.userAgent;

        await this.signatureRepository.save(signature);

        // Verificar si el contrato está completamente firmado
        const contractStatus = await this.updateContractSignatureStatus(contract.id);

        // Si está completamente firmado, enviar email de confirmación
        if (contractStatus === ContractSignatureStatus.FULLY_SIGNED) {
            await this.sendCompletionNotification(contract);
        }

        return {
            message: 'Firma registrada exitosamente',
            contractStatus: contractStatus
        };
    }

    async getSignatureStatus(contractId: string): Promise<SignatureStatusResponseDto> {
        const contract = await this.contractRepository.findOne({
            where: { id: contractId },
            relations: ['signatures']
        });

        if (!contract) {
            throw new NotFoundException('Contrato no encontrado');
        }

        const signatures = contract.signatures.map(sig => ({
            signerType: sig.signerType,
            signerName: sig.signerName,
            status: sig.status,
            signedAt: sig.signedAt
        }));

        return {
            signatureStatus: contract.signatureStatus,
            signatures,
            isFullySigned: contract.signatureStatus === ContractSignatureStatus.FULLY_SIGNED,
            signatureStartedAt: contract.signatureStartedAt
        };
    }

    async resendSignatureInvitation(contractId: string, signerType: SignerType): Promise<{ message: string }> {
        const contract = await this.contractRepository.findOne({
            where: { id: contractId },
            relations: ['signatures']
        });

        if (!contract) {
            throw new NotFoundException('Contrato no encontrado');
        }

        const signature = contract.signatures.find(sig => 
            sig.signerType === signerType && sig.status === SignatureStatus.PENDING
        );

        if (!signature) {
            throw new NotFoundException('Firma pendiente no encontrada para este tipo de firmante');
        }

        // Extender la fecha de expiración
        signature.tokenExpiration = new Date();
        signature.tokenExpiration.setDate(signature.tokenExpiration.getDate() + 7);
        await this.signatureRepository.save(signature);

        // Reenviar email
        const email = signerType === SignerType.CLIENT ? contract.clientEmail : 
                     // Aquí necesitarías obtener el email del agente, podrías agregarlo al contrato
                     'agente@inmobiliaria.com'; // Valor por defecto o configurable

        await this.sendSignatureInvitation(
            email,
            signature.signerName,
            signature.signatureToken,
            contract
        );

        return { message: 'Invitación reenviada exitosamente' };
    }

    private generateSignatureToken(): string {
        return `sign_${uuidv4().replace(/-/g, '')}_${Date.now()}`;
    }

    private async updateContractSignatureStatus(contractId: string): Promise<ContractSignatureStatus> {
        const contract = await this.contractRepository.findOne({
            where: { id: contractId },
            relations: ['signatures']
        });

        const signedCount = contract.signatures.filter(sig => sig.status === SignatureStatus.SIGNED).length;
        const totalSignatures = contract.signatures.length;

        let newStatus: ContractSignatureStatus;

        if (signedCount === 0) {
            newStatus = ContractSignatureStatus.PENDING_SIGNATURES;
        } else if (signedCount < totalSignatures) {
            newStatus = ContractSignatureStatus.PARTIALLY_SIGNED;
        } else {
            newStatus = ContractSignatureStatus.FULLY_SIGNED;
        }

        contract.signatureStatus = newStatus;
        await this.contractRepository.save(contract);

        return newStatus;
    }

    private async sendSignatureInvitations(
        contract: ContractEntity, 
        clientToken: string, 
        agentToken: string, 
        initiateDto: InitiateSignatureDto
    ): Promise<void> {
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

        // Enviar al cliente
        await this.sendSignatureInvitation(
            initiateDto.clientEmail,
            contract.clientName,
            clientToken,
            contract
        );

        // Enviar al agente
        await this.sendSignatureInvitation(
            initiateDto.agentEmail,
            contract.agentName,
            agentToken,
            contract
        );
    }

    private async sendSignatureInvitation(
        email: string,
        name: string,
        token: string,
        contract: ContractEntity
    ): Promise<void> {
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const signatureUrl = `${baseUrl}/signature/${token}`;

        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background-color: #f9fafb; }
                    .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { background-color: #e5e7eb; padding: 10px; font-size: 12px; text-align: center; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Invitación para Firma Digital</h1>
                    </div>
                    <div class="content">
                        <p>Estimado/a <strong>${name}</strong>,</p>
                        
                        <p>Ha sido invitado/a a firmar digitalmente el <strong>Contrato #${contract.contractNumber}</strong>.</p>
                        
                        <p><strong>Detalles del contrato:</strong></p>
                        <ul>
                            <li>Tipo: ${contract.type}</li>
                            <li>Monto: $${contract.amount}</li>
                            <li>Cliente: ${contract.clientName}</li>
                            <li>Agente: ${contract.agentName}</li>
                        </ul>
                        
                        <p>Para firmar el contrato, haga clic en el siguiente botón:</p>
                        
                        <a href="${signatureUrl}" class="button">Firmar Contrato</a>
                        
                        <p><strong>Instrucciones:</strong></p>
                        <ol>
                            <li>Haga clic en el enlace de arriba</li>
                            <li>Verifique su identidad con su documento de identidad</li>
                            <li>Revise el contrato completo</li>
                            <li>Dibuje su firma en el área designada</li>
                            <li>Confirme la firma</li>
                        </ol>
                        
                        <p><strong>Importante:</strong> Este enlace expira en 7 días. Si necesita más tiempo o tiene problemas, póngase en contacto con nosotros.</p>
                    </div>
                    <div class="footer">
                        <p>Este es un mensaje automático, por favor no responda a este email.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.emailService.sendEmail({
            to: email,
            subject: `Firma Digital Requerida - Contrato #${contract.contractNumber}`,
            html: emailHtml
        });
    }

    private async sendCompletionNotification(contract: ContractEntity): Promise<void> {
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #059669; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background-color: #f9fafb; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✅ Contrato Completamente Firmado</h1>
                    </div>
                    <div class="content">
                        <p>¡Felicitaciones!</p>
                        
                        <p>El <strong>Contrato #${contract.contractNumber}</strong> ha sido firmado exitosamente por todas las partes.</p>
                        
                        <p><strong>Detalles:</strong></p>
                        <ul>
                            <li>Cliente: ${contract.clientName}</li>
                            <li>Agente: ${contract.agentName}</li>
                            <li>Monto: $${contract.amount}</li>
                            <li>Fecha de finalización: ${new Date().toLocaleDateString('es-ES')}</li>
                        </ul>
                        
                        <p>El contrato firmado estará disponible en su panel de administración.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Enviar a ambas partes
        if (contract.clientEmail) {
            await this.emailService.sendEmail({
                to: contract.clientEmail,
                subject: `Contrato #${contract.contractNumber} - Firmado Completamente`,
                html: emailHtml
            });
        }

        // Para el agente, necesitarías obtener su email del sistema
        // Esto podría requerir una consulta adicional o almacenar el email del agente
    }
}