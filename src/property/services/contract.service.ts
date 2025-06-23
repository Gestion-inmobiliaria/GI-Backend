import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractEntity, ContractType } from '../entities/contract.entity';
import { PropertyEntity, EstadoProperty } from '../entities/property.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContractDto, UpdateContractDto } from '@/property/dto';
import { PaymentMethodEntity, PAYMENTMETHOD } from '@/realstate/entities/payment_method.entity';
import { PaymentStripeService } from '@/realstate/services/payment-stripe.service';
import { PaymentEntity, PaymentStatus } from '../entities/payment.entity';
import { EmailService } from '@/providers/email/email.service';

import { generatePdfFromHtml } from '@/common/utils/pdf.utils';
import { ContractEmailService } from './contract-email.service';

@Injectable()
export class ContractService {
    constructor(
        @InjectRepository(ContractEntity)
        private readonly contractRepository: Repository<ContractEntity>,
        @InjectRepository(PropertyEntity)
        private readonly propertyRepository: Repository<PropertyEntity>,
        @InjectRepository(PaymentMethodEntity)
        private readonly paymentMethodRepository: Repository<PaymentMethodEntity>,
        @InjectRepository(PaymentEntity)
        private readonly paymentRepository: Repository<PaymentEntity>,
        private readonly paymentStripeService: PaymentStripeService,
        private readonly contractEmailService: ContractEmailService,
    ) { }

    async create(createContractDto: CreateContractDto): Promise<ContractEntity> {
        const property = await this.propertyRepository.findOne({ where: { id: String(createContractDto.propertyId) } });
        if (!property) {
            throw new NotFoundException('Propiedad no encontrada');
        }

        const paymentMethod = await this.paymentMethodRepository.findOne({ where: { id: String(createContractDto.paymentMethodId) } });
        if (!paymentMethod) {
            throw new NotFoundException('Método de pago no encontrado');
        }

        // Crear el contrato
        const contract = this.contractRepository.create({
            ...createContractDto,
            property,
            payment_method: paymentMethod,
        });

        const savedContract = await this.contractRepository.save(contract);

        // Actualizar estado de la propiedad según el tipo de contrato
        await this.updatePropertyState(property, createContractDto.type);

        if (createContractDto.clientEmail) {
            const pdfBuffer = await generatePdfFromHtml(createContractDto.contractContent);
            await this.contractEmailService.sendContractEmail({
                to: createContractDto.clientEmail,
                clientName: createContractDto.clientName,
                pdfBuffer,
            });
        }
        
        return savedContract;
    }

    private async updatePropertyState(property: PropertyEntity, contractType: ContractType): Promise<void> {
        let newState: EstadoProperty;

        switch (contractType) {
            case ContractType.VENTA:
                newState = EstadoProperty.VENDIDO;
                break;
            case ContractType.COMPRA:
                newState = EstadoProperty.RESERVADO;
                break;
            case ContractType.ALQUILER:
                newState = EstadoProperty.ALQUILADO;
                break;
            case ContractType.ANTICRETICO:
                newState = EstadoProperty.ANTICRETADO;
                break;
            default:
                newState = EstadoProperty.OCUPADO;
        }

        property.estado = newState;
        await this.propertyRepository.save(property);
    }

    async createPaymentIntent(contractId: string, amount: number): Promise<any> {
        const contract = await this.contractRepository.findOne({
            where: { id: contractId },
            relations: ['payment_method']
        });

        if (!contract) {
            throw new NotFoundException('Contrato no encontrado');
        }

        // Si es efectivo, crear pago simulado
        if (contract.payment_method.name === PAYMENTMETHOD.cash) {
            const result = await this.paymentStripeService.createSimulatedPaymentForCash(
                amount,
                contract.contractNumber.toString()
            );

            // Crear registro de pago
            const payment = this.paymentRepository.create({
                stripePaymentIntentId: result.paymentIntentId,
                amount: amount,
                currency: 'USD',
                status: PaymentStatus.SUCCEEDED,
                stripeClientSecret: result.clientSecret,
                contract: contract,
                payment_method: contract.payment_method,
                paidAt: new Date(),
                metadata: { type: 'cash_simulation' }
            });

            await this.paymentRepository.save(payment);
            return result;
        }

        // Para otros métodos, crear intención de pago normal
        const result = await this.paymentStripeService.createPaymentIntent({
            amount: amount,
            currency: 'USD',
            paymentMethod: contract.payment_method.name,
            clientEmail: contract.clientEmail,
            clientName: contract.clientName,
            contractNumber: contract.contractNumber.toString()
        });

        // Crear registro de pago pendiente
        const payment = this.paymentRepository.create({
            stripePaymentIntentId: result.paymentIntentId,
            amount: amount,
            currency: 'USD',
            status: PaymentStatus.PENDING,
            stripeClientSecret: result.clientSecret,
            contract: contract,
            payment_method: contract.payment_method,
            metadata: { type: 'stripe_payment' }
        });

        await this.paymentRepository.save(payment);
        return result;
    }

    async confirmPayment(paymentIntentId: string): Promise<boolean> {
        const payment = await this.paymentRepository.findOne({
            where: { stripePaymentIntentId: paymentIntentId }
        });

        if (!payment) {
            throw new NotFoundException('Pago no encontrado');
        }

        const isConfirmed = await this.paymentStripeService.confirmPayment(paymentIntentId);

        if (isConfirmed) {
            payment.status = PaymentStatus.SUCCEEDED;
            payment.paidAt = new Date();
            await this.paymentRepository.save(payment);
        }

        return isConfirmed;
    }

    async findAll(): Promise<ContractEntity[]> {
        return await this.contractRepository.find({
            relations: ['property', 'payment_method'],
        });
    }

    async findOne(id: number): Promise<ContractEntity> {
        const contract = await this.contractRepository.findOne({
            where: { id: String(id) },
            relations: ['property', 'payment_method'],
        });

        if (!contract) {
            throw new NotFoundException('Contrato no encontrado');
        }

        return contract;
    }

    async update(id: number, updateContractDto: UpdateContractDto): Promise<ContractEntity> {
        const contract = await this.findOne(id);

        const property = await this.propertyRepository.findOne({ where: { id: String(updateContractDto.propertyId) } });
        if (!property) {
            throw new NotFoundException('Propiedad no encontrada');
        }

        const paymentMethod = await this.paymentMethodRepository.findOne({ where: { id: String(updateContractDto.paymentMethodId) } });
        if (!paymentMethod) {
            throw new NotFoundException('Método de pago no encontrado');
        }

        Object.assign(contract, {
            ...updateContractDto,
            property,
            payment_method: paymentMethod,
        });

        return await this.contractRepository.save(contract);
    }

    async remove(id: number): Promise<void> {
        const contract = await this.findOne(id);
        await this.contractRepository.remove(contract);
    }
}
