import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertyEntity } from '../entities/property.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ContractSignatureService } from './contract-signature.service';
import { ContractEntity, SignatureStatus } from '../entities/contract.entity';
import { PaymentMethodEntity } from '@/realstate/entities/payment_method.entity';
import { CreateContractDto, UpdateContractDto, CreateContractWithSignatureDto } from '@/property/dto';

@Injectable()
export class ContractService {
    constructor(
        @InjectRepository(ContractEntity)
        private readonly contractRepository: Repository<ContractEntity>,
        @InjectRepository(PropertyEntity)
        private readonly propertyRepository: Repository<PropertyEntity>,
        @InjectRepository(PaymentMethodEntity)
        private readonly paymentMethodRepository: Repository<PaymentMethodEntity>,
        private readonly contractSignatureService: ContractSignatureService,
    ) {}

    async create(createContractDto: CreateContractDto): Promise<ContractEntity> {
        const property = await this.propertyRepository.findOne({ 
            where: { id: String(createContractDto.propertyId) } 
        });
        if (!property) {
            throw new NotFoundException('Propiedad no encontrada');
        }

        const paymentMethod = await this.paymentMethodRepository.findOne({ 
            where: { id: String(createContractDto.paymentMethodId) } 
        });
        if (!paymentMethod) {
            throw new NotFoundException('Método de pago no encontrado');
        }

        const contract = this.contractRepository.create({
            ...createContractDto,
            property,
            payment_method: paymentMethod,
            // Establecer estado de firma según si se requiere o no
            signatureStatus: createContractDto.requiresSignature ? 
                            SignatureStatus.NO_REQUIRED : 
                            SignatureStatus.NO_REQUIRED
        });

        return await this.contractRepository.save(contract);
    }

    // NUEVO MÉTODO: Crear contrato y automaticamente iniciar proceso de firma
    async createWithSignature(createDto: CreateContractWithSignatureDto): Promise<{
        contract: ContractEntity;
        signatureProcess: any;
    }> {
        // Crear el contrato primero
        const contractData: CreateContractDto = {
            ...createDto,
            requiresSignature: true
        };

        const contract = await this.create(contractData);

        // Iniciar proceso de firma automáticamente
        const signatureProcess = await this.contractSignatureService.initiateSignatureProcess(
            contract.id,
            {
                clientEmail: createDto.clientEmailForSignature,
                agentEmail: createDto.agentEmailForSignature
            }
        );

        return {
            contract,
            signatureProcess
        };
    }

    async findAll(): Promise<ContractEntity[]> {
        return await this.contractRepository.find({
            relations: ['property', 'payment_method', 'signatures'],
        });
    }

    async findOne(id: number): Promise<ContractEntity> {
        const contract = await this.contractRepository.findOne({
            where: { id: String(id) },
            relations: ['property', 'payment_method', 'signatures'],
        });

        if (!contract) {
            throw new NotFoundException('Contrato no encontrado');
        }

        return contract;
    }

    // NUEVO MÉTODO: Buscar contrato por ID string (para firmas)
    async findOneById(id: string): Promise<ContractEntity> {
        const contract = await this.contractRepository.findOne({
            where: { id },
            relations: ['property', 'payment_method', 'signatures'],
        });

        if (!contract) {
            throw new NotFoundException('Contrato no encontrado');
        }

        return contract;
    }

    async update(id: number, updateContractDto: UpdateContractDto): Promise<ContractEntity> {
        const contract = await this.findOne(id);

        if (updateContractDto.propertyId) {
            const property = await this.propertyRepository.findOne({ 
                where: { id: String(updateContractDto.propertyId) } 
            });
            if (!property) {
                throw new NotFoundException('Propiedad no encontrada');
            }
            contract.property = property;
        }

        if (updateContractDto.paymentMethodId) {
            const paymentMethod = await this.paymentMethodRepository.findOne({ 
                where: { id: String(updateContractDto.paymentMethodId) } 
            });
            if (!paymentMethod) {
                throw new NotFoundException('Método de pago no encontrado');
            }
            contract.payment_method = paymentMethod;
        }

        Object.assign(contract, updateContractDto);

        return await this.contractRepository.save(contract);
    }

    async remove(id: number): Promise<void> {
        const contract = await this.findOne(id);
        await this.contractRepository.remove(contract);
    }

    // NUEVO MÉTODO: Obtener contratos por estado de firma
    async findBySignatureStatus(status: SignatureStatus): Promise<ContractEntity[]> {
        return await this.contractRepository.find({
            where: { signatureStatus: status },
            relations: ['property', 'payment_method', 'signatures'],
        });
    }

    // NUEVO MÉTODO: Obtener estadísticas de contratos por estado de firma
    async getSignatureStatistics(): Promise<{
        total: number;
        noSignatureRequired: number;
        pendingSignatures: number;
        partiallySigned: number;
        fullySigned: number;
        expired: number;
    }> {
        const total = await this.contractRepository.count();
        const noSignatureRequired = await this.contractRepository.count({
            where: { signatureStatus: SignatureStatus.NO_REQUIRED }
        });
        const pendingSignatures = await this.contractRepository.count({
            where: { signatureStatus: SignatureStatus.PENDING_SIGNATURES }
        });
        const partiallySigned = await this.contractRepository.count({
            where: { signatureStatus: SignatureStatus.PARTIALLY_SIGNED }
        });
        const fullySigned = await this.contractRepository.count({
            where: { signatureStatus: SignatureStatus.FULLY_SIGNED }
        });
        const expired = await this.contractRepository.count({
            where: { signatureStatus: SignatureStatus.SIGNATURE_EXPIRED }
        });

        return {
            total,
            noSignatureRequired,
            pendingSignatures,
            partiallySigned,
            fullySigned,
            expired
        };
    }
}