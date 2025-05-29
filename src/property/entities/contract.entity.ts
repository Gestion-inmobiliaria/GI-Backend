import { PropertyEntity } from "./property.entity";
import { BaseEntity } from "@/common/entities/base.entity";
import { ContractSignatureEntity } from './contract-signature.entity';
import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { PaymentMethodEntity } from "@/realstate/entities/payment_method.entity";


export enum ContractType {
    COMPRA = 'COMPRA',
    VENTA = 'VENTA',
    ANTICRETICO = 'ANTICRETICO'
}

export enum ContractStatus {
    VIGENTE = 'VIGENTE',
    FINALIZADO = 'FINALIZADO',
}

export enum ContractFormat {
    PDF = 'pdf',
    HTML = 'html'
}

// NUEVO ENUM PARA ESTADO DE FIRMAS
export enum Signature_Status {
    NO_REQUIRED = 'NO_REQUIRED',           // Contrato tradicional sin firmas
    PENDING_SIGNATURES = 'PENDING_SIGNATURES',   // Esperando que ambos firmen
    PARTIALLY_SIGNED = 'PARTIALLY_SIGNED',       // Una persona firmó
    FULLY_SIGNED = 'FULLY_SIGNED',              // Ambas personas firmaron
    SIGNATURE_EXPIRED = 'SIGNATURE_EXPIRED'      // Tokens expiraron
}

@Entity({ name: 'contract' })
export class ContractEntity extends BaseEntity {
    @Column({ type: 'integer', nullable: false })
    contractNumber: number;

    @Column({
        type: 'enum',
        enum: ContractType,
        nullable: false
    })
    type: ContractType;

    @Column({
        type: 'enum',
        enum: ContractStatus,
        nullable: false
    })
    status: ContractStatus;

    // NUEVO CAMPO PARA ESTADO DE FIRMAS
    @Column({
        type: 'enum',
        enum: Signature_Status,
        default: Signature_Status.PENDING_SIGNATURES,
        nullable: true
    })
    signature_Status: Signature_Status;

    // NUEVO CAMPO PARA FECHA DE INICIO DE PROCESO DE FIRMA
    @Column({ type: 'timestamp with time zone', nullable: true })
    signatureStartedAt: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    amount: number;
    
    @Column({ type: 'date', nullable: false })
    startDate: Date;
    
    @Column({ type: 'date', nullable: false })
    endDate: Date;
    
    // Datos del cliente
    @Column({ type: 'varchar', length: 100, nullable: false })
    clientName: string;
    
    @Column({ type: 'varchar', length: 50, nullable: false })
    clientDocument: string;
    
    @Column({ type: 'varchar', length: 255, nullable: true })
    clientPhone: string;
    
    @Column({ type: 'varchar', length: 255, nullable: true })
    clientEmail: string;
    
    // Datos del agente
    @Column({ type: 'varchar', length: 100, nullable: false })
    agentName: string;
    
    @Column({ type: 'varchar', length: 50, nullable: false })
    agentDocument: string;
    
    // Contenido del contrato
    @Column({ type: 'text', nullable: false })
    contractContent: string; // Base64 del PDF o HTML del contrato
    
    @Column({
        type: 'enum',
        enum: ContractFormat,
        default: ContractFormat.HTML,
        nullable: false
    })
    contractFormat: ContractFormat;
    
    @Column({ type: 'varchar', length: 255, nullable: true })
    notes: string;

    @ManyToOne(() => PropertyEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    property: PropertyEntity;

    @ManyToOne(() => PaymentMethodEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    payment_method: PaymentMethodEntity;

    // NUEVA RELACIÓN CON FIRMAS
    @OneToMany(() => ContractSignatureEntity, (signature) => signature.contract, { cascade: true })
    signatures: ContractSignatureEntity[];
}